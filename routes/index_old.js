var express = require('express');
var router = express.Router();
var cesium = require('cesium');
var terrain = require('../terrain');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(terrain.getTerrain());
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
	var geojson = req.body;
	var promise = cesium.GeoJsonDataSource.load(geojson);				
	var matriu=[];
	var entitatsId=[];
	var terreny = terrain.getTerrain();				
	console.log("pas2");
	console.info("pas2.1");
	promise.then(function (dataSource) {																				
			var collection = dataSource.entities;
			var entities = collection.values;
			var length = entities.length;
			console.info("pas3");
			for (var i = 0; i < length; ++i) {
			  var entity = entities[i];
				//Cesium.Ellipsoid.WGS84.
				//console.info(entity);
				//console.info(entity.id)
				entitatsId.push(entity.id);	
				if (entity.billboard) {
					var point = cesium.Ellipsoid.WGS84.cartesianToCartographic(entity.position._value);					
					matriu.push(cesium.Cartographic
						.fromRadians(
							point.longitude,
							point.latitude));
				} else if (entity.polyline) {
					for (var j = 0; j < entity.polyline.positions._value.length; ++j) {
						var point = cesium.Ellipsoid.WGS84
							.cartesianToCartographic(entity.polyline.positions._value[j])
							matriu
							.push(cesium.Cartographic
								.fromRadians(
									point.longitude,
									point.latitude));
					}
				} else if (entity.polygon) {
					for (var j = 0; j < entity.polygon._hierarchy._value.positions.length; ++j) {
						var point = cesium.Ellipsoid.WGS84
							.cartesianToCartographic(entity.polygon._hierarchy._value.positions[j])											
							matriu.push(cesium.Cartographic
								.fromRadians(
									point.longitude,
									point.latitude));
					}
				}
				
				//console.log(terreny);
				console.log("Pas4");
				
				//cesium.sampleTerrain(terreny, 13, matriu, dataSource).then(function(updatePositions) {
				console.log(matriu.length);
				terreny.ready = true;
				terreny._ready = true;
				
				var promise1 = cesium.sampleTerrain(terreny, 13, matriu);

			  console.log(promise1);
			
			  promise1.then(function (updatedPositions) {
				
				  console.log(updatedPositions);


				}).otherwise(function (error) {
			  console.log("error");
		  	console.log(error);
		    });	
			}		
		}).otherwise(function (error) {
			console.log("error");
			console.log(error);
		});
  res.send(geojson);
});

module.exports = router;
