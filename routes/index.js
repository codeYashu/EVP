var express = require('express');
var router = express.Router();
var ambulance = require('./ambulanceRoute');
var i=0;
var prev=0;
/* GET home page. */
router.get('/', function(req, res, next) {
  ambulance.addAmbulance(i);
  i=i+1
  res.render('index', { title: 'Express' });
});

module.exports = router;

function getDistance(lat1, long1, lat2, long2){
  var y = Math.sin(long2-long1) * Math.cos(lat2);
  var x = Math.cos(lat1)*Math.sin(lat2) -
          Math.sin(lat1)*Math.cos(lat2)*Math.cos(long2-long1);

  console.log(x + "" + y);
  return x, y;
}
