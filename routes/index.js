var express = require('express');
var router = express.Router();
var config = require('../config');
var gdal_elevate = require('../gdal_location_info');
var el = gdal_elevate(config.demFile);
/* GET home page. */
router.get('/' + config.pathMainWeb + '/', function(req, res, next) {
  res.render('index', { title: 'Add Z Service' });
});

router.post('/' + config.pathMainWeb + '/', function(req, res, next) {
  var geojson = req.body;
  var geojson3D = el.featureCollection(geojson);
  res.send(geojson3D);
});

module.exports = router;
