var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var config = require('../config');
var should = chai.should();

chai.use(chaiHttp);
server.listen(3004);

describe('Terrain', function(){
  
  it('server up', function(done) {
  chai.request(server)
    .get('/' + config.pathMainWeb + '/')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });

  it('point', function(done){
    chai.request(server)
    .post('/' + config.pathMainWeb + '/')
    .send({
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              -1.9335937499999998,
              41.77131167976407
            ]
          }
        }
      ]
    })
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('type');
      res.body.should.have.property('features');
      res.body.features.should.be.a('array');
      res.body.features[0].should.have.property('geometry');
      res.body.features[0].geometry.should.have.property('coordinates');
      res.body.features[0].geometry.coordinates.should.be.a('array');
      res.body.features[0].geometry.coordinates.should.have.length(3);
      should.exist(res.body.features[0].geometry.coordinates[2]);
      done();
    });
  });

  it('linestring', function(done){
    chai.request(server)
    .post('/' + config.pathMainWeb + '/')
    .send({
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                1.6644287109375,
                42.216313604344776
              ],
              [
                1.6973876953125,
                42.25088477477567
              ],
              [
                1.724853515625,
                42.279340930853145
              ],
              [
                1.7413330078125,
                42.30778424213693
              ],
              [
                1.7413330078125,
                42.33215399891373
              ],
              [
                1.7413330078125,
                42.35448465106744
              ],
              [
                1.74407958984375,
                42.397093870535514
              ],
              [
                1.74407958984375,
                42.407234661551875
              ]
            ]
          }
        }
      ]
    })
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('type');
      res.body.should.have.property('features');
      res.body.features.should.be.a('array');
      res.body.features[0].should.have.property('geometry');
      res.body.features[0].geometry.should.have.property('coordinates');
      res.body.features[0].geometry.coordinates.should.be.a('array');
      res.body.features[0].geometry.coordinates[0].should.have.length(3);
      should.exist(res.body.features[0].geometry.coordinates[0][2]);
      done();
    });
  });
  it('polygon', function(done) {
    chai.request(server)
    .post('/' + config.pathMainWeb + '/')
    .send({
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates":[
              [
                [-67.13734351262877, 45.137451890638886],
                [-66.96466, 44.8097],
                [-68.03252, 44.3252],
                [-69.06, 43.98],
                [-70.11617, 43.68405],
                [-70.64573401557249, 43.090083319667144],
                [-70.75102474636725, 43.08003225358635],
                [-70.79761105007827, 43.21973948828747],
                [-70.98176001655037, 43.36789581966826],
                [-70.94416541205806, 43.46633942318431],
                [-71.08482, 45.3052400000002],
                [-70.6600225491012, 45.46022288673396],
                [-70.30495378282376, 45.914794623389355],
                [-70.00014034695016, 46.69317088478567],
                [-69.23708614772835, 47.44777598732787],
                [-68.90478084987546, 47.184794623394396],
                [-68.23430497910454, 47.35462921812177],
                [-67.79035274928509, 47.066248887716995],
                [-67.79141211614706, 45.702585354182816],
                [-67.13734351262877, 45.137451890638886]
              ]
            ]
          }
        }
      ]
    })
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('type');
      res.body.should.have.property('features');
      res.body.features.should.be.a('array');
      res.body.features[0].should.have.property('geometry');
      res.body.features[0].geometry.should.have.property('coordinates');
      res.body.features[0].geometry.coordinates.should.be.a('array');
      res.body.features[0].geometry.coordinates[0][0].should.have.length(3);
      should.exist(res.body.features[0].geometry.coordinates[0][0][2]);
      done();
    });

  });

});
