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

/*
if (require.main === module) {
    if (process.argv.length < 3) {
    	// Show usage. At least the DEM file should be specified as parameter.
    	var command = require('path').basename(process.argv[1]);
    	console.log('\nAdd a 3rd dimension (Z coordinate) to vector data, read from a Digital Elevation Model. \
Similar to "gdallocationinfo" utility, but applied to an entire vector file. \
No reprojection is performed, so both DEM and vector file should be in the same CRS.');
        console.log('\nUsage: %s dem_file [src_file [dst_file]]\n', command);
        console.log('   dem_file: the raster DEM file to get Z coordinates from. Required.');
        console.log('   src_file: the input 2D vector file. Read from stdin if not specified.');
        console.log('   dst_file: the output 3D vector file. Written to stdout if not specified.\n');
    } else {
    	// Run script
        var dem = process.argv[2];
        var src = process.argv[3] || undefined;
        try {
            var elevate = elevation(dem);
            elevate.featureCollection(src);
        } catch(e) {
            console.error(e.message);
        }
    }
} else {

}
*/
/*
var dataset = gdal.open("//Nicosia/z/geotif3D/Catlunya_Pirineu.tif");
var band = dataset.bands.get(1);
var geotransform = dataset.geoTransform;
//var nodata = band.noDataValue;

var pp = mapToPixel(geotransform, [1.245875, 42.454826], band);
console.log(pp);

function mapToPixel(gt, pos, band){
  var xOrigin = gt[0];
  var yOrigin = gt[3];
  var pixelWidth = gt[1];
  var pixelHeight = gt[5];

  //console.log(band.size);
  var xOffset = parseInt((pos[0] - xOrigin) / pixelWidth);
  var yOffset = parseInt((pos[1] - yOrigin) / pixelHeight);

  var value = band.pixels.get(xOffset,yOffset);
  return value;
}
*/
