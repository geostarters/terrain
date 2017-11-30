#!/usr/bin/env node
'use strict';
var gdal = require('gdal');
const request = require("request-promise");

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
            var count = linestring.length;
            for (var i = 0; i < count; i++) {
                linestring[i] = await elevate.point(linestring[i]);
            }
            return linestring;
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
