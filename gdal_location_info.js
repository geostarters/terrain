#!/usr/bin/env node
'use strict';
var gdal = require('gdal');
const request = require("request-promise");

var minPointsInTrack = 100;

var elevation = function(file) {
    try {
        var raster = gdal.open(file);
    } catch(e) {
        throw Error("Error reading DEM file: " + file);
    }
    var transform = raster.geoTransform;
    var band = raster.bands.get(1);
    var pixels = band.pixels;
    var size = band.size;
    var nodata = band.noDataValue || NaN;

    // This is the interface that can be used when imported as a module
    var elevate = {
    	// Simplest use case, doesn't require gdal from the outside
        z: async function(x, y) {
            var h = NaN;
            var col = Math.round((x - transform[0]) / transform[1]);
            var row = Math.round((y - transform[3]) / transform[5]);
            if (row >= 0 && col >= 0 && col < size.x && row < size.y) {
                h = pixels.get(col, row);
            }

            if(h == nodata || isNaN(h) || h == null) {
                try {

                    const url = `http://api.geonames.org/gtopo30JSON?lat=${y}&lng=${x}&username=geostarters`;
                    const body = await request(url);
                    const data = JSON.parse(body);
                    return data.gtopo30;
                    
                } catch (err) {
                    console.log(err);
                }
            }
            return h == nodata ? NaN : h;
        },
        point: async function(point) {
            return [point[0], point[1], await elevate.z(point[0], point[1])];
        },
        linestring: async function(linestring) {

            var newLineString = elevate.addPointsIfNotMinimumNumber(linestring);
            var count = linestring.length;

            for (var i = 0; i < count; i++) {
                newLineString[i] = await elevate.point(newLineString[i]);
            }

            return newLineString;
        },
        addPointsIfNotMinimumNumber: function(linestring) {

            var newLineString = linestring;
            var count = linestring.length;

            if(count < minPointsInTrack)
                newLineString = elevate.addPointsIntoLineString(linestring);

            return newLineString;

        },
        addPointsIntoLineString: function(linestring) {

            var newLineString = linestring.slice();
            var count = linestring.length;
            var pointsToGenerate = minPointsInTrack - count;
            var trackSegments = count - 1;
            var pointsInSegment = Math.ceil(pointsToGenerate / trackSegments) + 1;
            var insertionPoint = 0;

            console.log(count + " input points");
            console.log(trackSegments + " track segments");
            console.log(pointsToGenerate + " points to generate");
            console.log(pointsInSegment + " points in each segment");

            for(var i=0; i<count-1; ++i) {

                var startPoint = linestring[i];
                var endPoint = linestring[i+1];
                var xInc = endPoint[0] - startPoint[0];
                var yInc = endPoint[1] - startPoint[1];
                var xIncPerPoint = xInc / pointsInSegment;
                var yIncPerPoint = yInc / pointsInSegment;

                for(var j=1; j<pointsInSegment; ++j) {
                 
                    var newPoint = [startPoint[0] + xIncPerPoint*j, 
                        startPoint[1] + yIncPerPoint*j];
                    newLineString.splice(++insertionPoint, 0, newPoint);

                    console.log("Adding point " + newPoint[0] + "," + newPoint[1] + " between " + i + " and " + (i+1) + " at " + insertionPoint);
                    
                }

                ++insertionPoint;

            }

            return newLineString;

        },
        polygon: async function(polygon) {
            var count = polygon.length;
            for (var i = 0; i < count; i++) {
                polygon[i] = await elevate.linestring(polygon[i]);
            }
            return polygon;
        },
        geometry: async function(geometry) {
            // TODO support distinct MultiPolygon, MultiPoint and MultiLineString ?
            if (geometry.type === 'Point') { // is a point
                return await elevate.point(geometry.coordinates);
            } else if (geometry.type === 'LineString') { // is a linestring
                return await elevate.linestring(geometry.coordinates);
            } else if (geometry.type === 'Polygon') { // is a polygon
                return await elevate.polygon(geometry.coordinates);
            } else if (geometry.type === 'Feature') { // is a collection
                return await elevate.feature(geometry);
            }
        },
        feature: async function(feature){
          var geometry = feature.geometry;
          feature.geometry.coordinates = await elevate.geometry(geometry);
          return feature;
        },
        featureCollection: async function(collection) {
          var features = collection.features;
          var count = features.length;
          for (var i = 0; i < count; i++) {
              features[i] = await elevate.feature(features[i]);
          }
          collection.features = features;
          return collection;
        }
    };

    return elevate;
};

// Use as a module
module.exports = elevation;
