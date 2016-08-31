var express = require('express');
var fs=require('fs');
var terrain = require('../terrain');
var router = express.Router();

/* GET users listing. */
router.get('/demextes/:file', function(req, res, next) {
	
	var file = terrain.getTerrain();
	
	 res.setHeader('Content-Type', 'application/json');
	//E:/usuaris/v.pascual/nginx/html/cesium/terrenys/demextes/
	
	//console.info(req);
	
	//var file = fs.readFileSync('E:/usuaris/v.pascual/nginx/html/cesium/terrenys/demextes/'+req.params.file);
	res.send(file);
});

router.get('/demextes/:z/:x/:y\.terrain', function(req, res, next) {
	 res.setHeader('Content-Type', 'application/octet-stream .terrain');
	//E:/usuaris/v.pascual/nginx/html/cesium/terrenys/demextes/
	console.log(req.params);
	console.log(req.params.z);
	console.log(req.params.x);
	console.log(req.params.y);
	console.log(req.query.v);
	
	var file = fs.readFileSync('E:/usuaris/v.pascual/nginx/html/cesium/terrenys/demextes/'+req.params.z+'/'+req.params.x+'/'+req.params.y+'.terrain?v=1.0.0');
  res.send(file);
});


module.exports = router;
