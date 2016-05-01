var mongoose = require('mongoose')
var Ambulance = require('../models/Ambulance');
var ambulance = Ambulance.Ambulance();
var express = require('express');
var router = express.Router();
//var ambulance = require('./ambulanceRoute');
var trafficSignal = require('../models/TrafficSignal');
var TrafficSignal = trafficSignal.TrafficSignal;
var app = require('../app');
var i=0;
var prev=0;

router.get('/signal', function(req, res){
  return res.json({yaay : 'status'});
});
