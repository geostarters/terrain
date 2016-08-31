var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var cesium = require('cesium');
var config = require('../config');
var gdal_elevate = require('../gdal_location_info');
var el = gdal_elevate(config.demFile);
/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(terrain.getTerrain());
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var geojson = req.body;
  var geojson3D = el.featureCollection(geojson);
  res.send(geojson3D);
});

module.exports = router;
