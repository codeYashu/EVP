var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrafficSignalSchema = new Schema({
  traffic_signal_id: Number,
  traffic_signal_service: Number,
  traffic_signal_location: {
                        lat: Number,
                        lon: Number
  },
  traffic_signal_points: {
			point_1:{
            	lat: Number,
            	lon: Number
  			},
			point_2:{
            	lat: Number,
            	lon: Number
  			},
			point_3:{
            	lat: Number,
            	lon: Number
  			},
			point_4:{
            	lat: Number,
            	lon: Number
  			}
  },

  theta:{
    point_1:Number,
    point_2:Number,
    point_3:Number,
    point_4:Number,
  }
});

var TrafficSignal = mongoose.model('TrafficSignal', TrafficSignalSchema);
module.exports.TrafficSignal = TrafficSignal;



/*
*Any activity or a service*
private final LocationListener locationListener = new LocationListener() {
    public void onLocationChanged(Location location) {
        longitude = location.getLongitude();
        latitude = location.getLatitude();
    }
}

lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 2000, 10, locationListener);

*manifest.xml*
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
*/
