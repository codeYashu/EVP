var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/AmbulanceEmergency');

var ambulances = require('./routes/ambulanceRoute');
var finalPoint = require('./finalpoints');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var server = require('http').Server(app);

//imports for IO
var trafficSignal = require('./models/TrafficSignal');
var TrafficSignal = trafficSignal.TrafficSignal;

console.log(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ambulance', ambulances)
//DEBUG=AmbulanceEmergency:* npm start


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


function LocationOnEarth(lat, lon) {
  this.lat = lat;
  this.lon = lon;

}


var io = require('socket.io')(server);

var initTrafficSignals = function() {

  var lat1 = 12.917248;
  var lon1 = 77.622710;

  var lat2 = 12.936719;
  var lon2 = 77.580031;


  var Point = finalPoint.newPos(lat1, lon1);
  var Point2 = finalPoint.newPos(lat2, lon2);


  var TrafficSignal1 = new TrafficSignal({
    traffic_signal_id: 0,
    traffic_signal_service: 0,
    traffic_signal_location: {
                          lat: lat1,
                          lon: lon1,
    },
    traffic_signal_points: {
        point_1:{
                lat: Point.plat[0],
                lon: Point.plon[0]
          },
        point_2:{
                lat: Point.plat[1],
                lon: Point.plon[1]
          },
        point_3:{
                lat: Point.plat[2],
                lon: Point.plon[2]
          },
        point_4:{
                lat: Point.plat[3],
                lon: Point.plon[3]
          }
    },

    theta:{
      point1:Point.t[0],
      point2:Point.t[1],
      point3:Point.t[2],
      point4:Point.t[3],
    }
  });
  TrafficSignal1.save();


  var TrafficSignal2 = new TrafficSignal({
    traffic_signal_id: 1,
    traffic_signal_service: 0,
    traffic_signal_location: {
                          lat: lat2,
                          lon: lon2,
    },
    traffic_signal_points: {
        point_1:{
                lat: Point2.plat[0],
                lon: Point.plon[0]
          },
        point_2:{
                lat: Point2.plat[1],
                lon: Point2.plon[1]
          },
        point_3:{
                lat: Point2.plat[2],
                lon: Point2.plon[2]
          },
        point_4:{
                lat: Point2.plat[3],
                lon: Point2.plon[3]
          }
    },

    theta:{
      point1:Point2.t[0],
      point2:Point2.t[1],
      point3:Point2.t[2],
      point4:Point2.t[3],
    }
  });
  console.log(TrafficSignal2);
  TrafficSignal2.save();
}


function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function getProximity(Location, currentTrafficSignal){
  //find distance between all the 4 points and the ambulance, return the status and traffic signal no
  var d = new Array();
  console.log("newCURRENT " + currentTrafficSignal);
    console.log("LOC : " + currentTrafficSignal.traffic_signal_points.point_1.lat);
   d[1] = distance(Location[0].lat, Location[0].lon, currentTrafficSignal.traffic_signal_points.point_1.lat, currentTrafficSignal.traffic_signal_points.point_1.lon)
   d[2] = distance(Location[0].lat, Location[0].lon, currentTrafficSignal.traffic_signal_points.point_2.lat, currentTrafficSignal.traffic_signal_points.point_2.lon)
   d[3] = distance(Location[0].lat, Location[0].lon, currentTrafficSignal.traffic_signal_points.point_3.lat, currentTrafficSignal.traffic_signal_points.point_3.lon)
   d[4] = distance(Location[0].lat, Location[0].lon, currentTrafficSignal.traffic_signal_points.point_4.lat, currentTrafficSignal.traffic_signal_points.point_4.lon)
  var min = Math.min(d[1],d[2],d[3],d[4]);
  console.log("D : " + d);

for (var i = 1; i < 5; i+1){
  if(min==d[i]){
    return {side:i, status:true};
  }
}

}



io.sockets.on('connection', function (socket) {

  function sendGreen(sideOfTraffic){
    io.emit('lightsGreen', JSON.stringify({side:1}));
  }

  var Location = new Array();
  initTrafficSignals();
  var counter = 0;
  var currentTrafficSignal;
  socket.emit('getLocation', {});
  socket.emit('connected', {status:true});
  //socket.emit('lightsGreen', JSON.stringify({side:1}));

  socket.on('sendLocation', function (data) {
    console.log(data);

    var jsonData = JSON.parse(data);
    if(jsonData.key != '9e4207dacba9b1a2e4185a80ddb88271302db0501455d49d0539cf0a7ba52ba7'){
      return JSON.stringify({access:'denied'});
    }
    Location.push(new LocationOnEarth(jsonData.location.lat, jsonData.location.lon));
    console.log(Location);


    TrafficSignal.find({ traffic_signal_id: jsonData.traffic_signal_id }, function(err, data) {
  	if (err) throw err;
  	currentTrafficSignal = data[0];
    console.log('TRAFFICSIGNAL :' + currentTrafficSignal);
    });

    if(counter<5){
	  socket.emit('getLocation', {});
    socket.emit('connected', {status:true});
    }else{
      var lat1 = 12.917248;
      var lon1 = 77.622710;
      var Point = finalPoint.newPos(lat1, lon1);
      console.log('CURRENT ' + currentTrafficSignal);
      console.log('LOCATION ' + Location);
    var side = getProximity(Location, currentTrafficSignal);
    SIDE = side.side;
    console.log("SIDE " + side.side);
    console.log("STATUS " + side.status);
    //socket.emit('lightsGreen', JSON.stringify({side:1}));
    if(side.status===true) {
    	//send signal to TrafficSignal to turn the lights to green and
	    //turn it off in 5mins.
      //res.json({status:true, side:side.side});
      console.log('EMITTING GREEN');
      /*
      IF_GREEN = true;
      setTimeout(function(){ IF_GREEN = false; }, 5000);
      */

      sendGreen(side.side);
    }
    else if(side.status!=true) {
      //res.json({status:false});
	//reject the request.

    }
    else {
      res.json({status:'No Change'});
	//no proximity change
    }

    }

    //increasing the counter for finding how many Locations the user has sent.
    counter++;
  });
});

server.listen(3000);

module.exports = app;
module.exports.LocationOnEarth = LocationOnEarth;
module.exports.server = server;
