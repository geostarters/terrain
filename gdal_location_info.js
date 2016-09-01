#!/usr/bin/env node
'use strict';
var gdal = require('gdal');

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
        z: function(x, y) {
            var h = NaN;
            var col = Math.round((x - transform[0]) / transform[1]);
            var row = Math.round((y - transform[3]) / transform[5]);
            if (row >= 0 && col >= 0 && col < size.x && row < size.y) {
                h = pixels.get(col, row);
            }
            return h == nodata ? NaN : h;
        },
        point: function(point) {
            return [point[0], point[1], elevate.z(point[0], point[1])];
        },
        linestring: function(linestring) {
            var count = linestring.length;
            for (var i = 0; i < count; i++) {
                linestring[i] = elevate.point(linestring[i]);
            }
            return linestring;
        },
        polygon: function(polygon) {
            var count = polygon.length;
            for (var i = 0; i < count; i++) {
                polygon[i] = elevate.linestring(polygon[i]);
            }
            return polygon;
        },
        geometry: function(geometry) {
            // TODO support distinct MultiPolygon, MultiPoint and MultiLineString ?
            if (geometry.type === 'Point') { // is a point
                return elevate.point(geometry.coordinates);
            } else if (geometry.type === 'LineString') { // is a linestring
                return elevate.linestring(geometry.coordinates);
            } else if (geometry.type === 'Polygon') { // is a polygon
                return elevate.polygon(geometry.coordinates);
            } else if (geometry.type === 'Feature') { // is a collection
                return elevate.feature(geometry);
            }
        },
        feature: function(feature){
          var geometry = feature.geometry;
          feature.geometry.coordinates = elevate.geometry(geometry);
          return feature;
        },
        featureCollection: function(collection) {
          var features = collection.features;
          var count = features.length;
          for (var i = 0; i < count; i++) {
              features[i] = elevate.feature(features[i]);
          }
          collection.features = features;
          return collection;
        }
    };

    return elevate;
};

// Use as a module
module.exports = elevation;
