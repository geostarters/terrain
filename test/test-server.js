var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Terrain', function(){
  /*
  it('server up', function(done) {
  chai.request(server)
    .get('/')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });

  it('point', function(done){
    chai.request(server)
    .post('/')
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
      done();
    });
  });

  it('linestring', function(done){
    chai.request(server)
    .post('/')
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
      done();
    });
  });
  it('polygon');
  it('geometry');
  it('feature');
  it('featureCollection');
  */

});
