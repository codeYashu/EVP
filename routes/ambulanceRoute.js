var mongoose = require('mongoose')
var Ambulance = require('../models/Ambulance');
var ambulance = Ambulance.Ambulance();
var Ambulances = [];
var express = require('express');
var router = express.Router();
var ambulance_id = 0;
var AMBULANCE_RANGE = 1;
//var ambulance = require('./ambulanceRoute');
var trafficSignal = require('../models/TrafficSignal');
var TrafficSignal = trafficSignal.TrafficSignal({
  traffic_signal_id: 1,
  traffic_signal_service: 1,
  traffic_signal_location: {
                        lat: 12.9211369,
                        lon: 77.620200
  }
});
var app = require('../app');
var i=0;
var prev=0;
/* GET home page. */
router.get('/', function(req, res, next) {
  ambulance.addAmbulance(i);
  i=i+1
  res.render('index', { title: 'Express' });
});

function LocationOnEarth(lat, lon) {
  this.lat = lat;
  this.lon = lon;
}

router.get('/loc', function(req, res){
  console.log('Lat: ' + req.param('lat') + ' ' + 'Lon: ' + req.param('lon'));
  var confirmation = getConfirmation(req.param('lat'), req.param('lon'));
  var status = confirmation.status, traffic_signal_id = confirmation.traffic_signal_id;
  return res.json({proximitystatus : status, ambulance_id: traffic_signal_id});
});

function getConfirmation(lat1, lon1){
	//get all the TrafficSignals in an array
    //find the shortest distance element
    //get the traffic signal id
    var distanceBetween = distance(lat1,
								                   lon1,
                                   TrafficSignal.traffic_signal_location.lat,
                                   TrafficSignal.traffic_signal_location.lon);
    console.log(distanceBetween);
    if(distanceBetween <= AMBULANCE_RANGE){
        var ambulance = new Ambulance({
          ambulance_id: ++ambulance_id,
          ambulance_service: 0,
          ambulance_location: {
                                lat: lat1,
                                lon: lon1,
          }
        });
        return {status:true, traffic_signal_id:ambulance_id};
    }else{
        return {status:false, traffic_signal_id:1};
    }
    //return status and traffic id

}

function distance(lat1, lon1, lat, lon) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat - lat1) * p)/2 +
          c(lat1 * p) * c(lat * p) *
          (1 - c((lon - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}




var addAmbulance = function(ambulance_id, ambulance_service, lat, lon){
  ambulance.ambulance_id= ambulance_id;
  ambulance.ambulance_service = ambulance_service;
  ambulance.ambulance_location.lat=lat;
  ambulance.ambulance_location.lon=lon;

  ambulance.save(function(err){
    if (!err) console.log('Success!');
  });

  Ambulances.push(ambulance);
}

module.exports.addAmbulance = addAmbulance;
module.exports = router;
