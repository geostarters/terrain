var chai = require('chai');
var should = chai.should();
var gdal_elevate = require('../gdal_location_info');
var el = gdal_elevate("DEM.tif");

describe('gdal_location_info', function(){

  describe('z',function(){
    it('z', function(){
      var z = el.z(2.062847891791044, 41.419828805970162);
      z.should.be.equal(373);
    });
  });

  describe('point',function(){
    var POINT = [2.193911660447761, 41.431202108208979];

    it('point', function(){
      var point = el.point(POINT);
      point.should.be.a('array');
      point.should.have.length(3);
      point[2].should.be.equal(24);
    });
  });

  describe('linestring',function(){
    var LINESTRING = [[ 1.971319888059701, 41.314761156716429 ], [ 1.976735746268656, 41.340215690298521 ], [ 1.95453072761194, 41.359171194029862 ], [ 1.959946585820895, 41.385167313432852 ], [ 1.973486231343283, 41.393291100746282 ], [ 1.989192220149253, 41.397082201492552 ], [ 1.994608078358209, 41.410080261194047 ],
    [ 2.002731865671641, 41.42470307835822 ], [ 2.022770541044776, 41.434993208955241 ], [ 2.045517145522388, 41.437701138059715 ], [ 2.074762779850746, 41.434451623134343 ], [ 2.090468768656716, 41.431743694029862 ], [ 2.089385597014925, 41.406830746268675 ], [ 2.090468768656716, 41.397623787313449 ],
    [ 2.112673787313432, 41.403581231343296 ], [ 2.120797574626865, 41.42037039179106 ], [ 2.08396973880597, 41.465863600746282 ]];

    it('linestring', function(){
      var linestring = el.linestring(LINESTRING);
      linestring.should.be.a('array');
      var point = linestring[0];
      point.should.have.length(3);
      point[2].should.be.equal(174);
    });
  });

  describe('polygon',function(){
    var POLYGON = [[[ 2.022228955223881, 41.331550317164201 ], [ 1.999482350746269, 41.360254365671665 ], [ 1.992441735074627, 41.368378152985102 ], [ 2.007606138059702, 41.387333656716443 ], [ 2.023853712686567, 41.405747574626893 ], [ 2.041184458955224, 41.397623787313456 ],
     [ 2.069888507462687, 41.367294981343306 ], [ 2.089927182835821, 41.322884944029873 ], [ 2.060139962686567, 41.303387854477634 ], [ 2.02114578358209, 41.290389794776146 ], [ 1.99569125, 41.315844328358232 ], [ 2.022228955223881, 41.331550317164201 ] ] ];

    it('polygon', function(){
      var polygon = el.polygon(POLYGON);
      polygon.should.be.a('array');
      var linestring = polygon[0];
      var point = linestring[0];
      point.should.have.length(3);
      point[2].should.be.equal(131);
    });
  });


  describe('geometry',function(){
    var GEOMETRY = {
      "type": "Point",
      "coordinates": [
        2.148418451492537, 41.497275578358234
      ]
    };

    it('geometry point', function(){
      var geometry = el.geometry(GEOMETRY);
      geometry.should.be.a('array');
      geometry[2].should.be.equal(67);
    });
  });


  describe('feature',function(){
    var FEATURE = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [ 2.207992891791045, 41.379209869402978 ], [ 2.179288843283582, 41.4127881902985 ], [ 2.1771225, 41.442033824626861 ], [ 2.178205671641791, 41.4620725 ], [ 2.157083824626866, 41.475612145522383 ], [ 2.111049029850746, 41.49835875 ], [ 2.086677667910448, 41.502691436567162 ],
          [ 2.054724104477612, 41.506482537313424 ], [ 2.030894328358209, 41.506482537313424 ], [ 1.979443675373134, 41.49565082089552 ], [ 1.946948526119403, 41.470196287313428 ], [ 1.942615839552239, 41.436617966417906 ], [ 1.942615839552239, 41.424161492537309 ], [ 1.946406940298508, 41.379209869402978 ],
          [ 1.978360503731343, 41.357004850746264 ], [ 1.982693190298508, 41.351588992537309 ], [ 1.958863414179105, 41.315844328358203 ], [ 1.935575223880597, 41.30609578358208 ], [ 1.936116809701493, 41.322343358208947 ], [ 1.928534608208955, 41.345089962686558 ], [ 1.920410820895523, 41.347797891791039 ]
        ]
      }
    };

    it('feature', function(){
      var feature = el.feature(FEATURE);
      feature.should.have.property('geometry');
      feature.geometry.should.have.property('coordinates');
      feature.geometry.coordinates.should.be.a('array');
      feature.geometry.coordinates[5].should.have.length(3);
      feature.geometry.coordinates[5][2].should.be.equal(111);
    });
  });


  describe('feature',function(){
      var FEATURE_COLECTION = {
      "type": "FeatureCollection",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      "features": [
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 2.062847891791044, 41.419828805970162 ] } },
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 2.193911660447761, 41.431202108208979 ] } },
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 2.148418451492537, 41.497275578358234 ] } },
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 2.009230895522388, 41.481028003731367 ] } },
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 1.937199981343283, 41.434993208955248 ] } },
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 1.932867294776119, 41.326676044776143 ] } },
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 1.962112929104477, 41.27847490671644 ] } },
        { "type": "Feature", "properties": { }, "geometry": { "type": "Point", "coordinates": [ 2.13000453358209, 41.36567022388062 ] } }
      ]
    };

    it('featureCollection', function(){
      var featureCollection = el.featureCollection(FEATURE_COLECTION);
      featureCollection.should.have.property('features');
      featureCollection.features.should.be.a('array');
      featureCollection.features[7].should.have.property('geometry');
      featureCollection.features[7].geometry.should.have.property('coordinates');
      featureCollection.features[7].geometry.coordinates.should.be.a('array');
      featureCollection.features[7].geometry.coordinates.should.have.length(3);
      featureCollection.features[7].geometry.coordinates[2].should.be.equal(12);
    });
  });

});
