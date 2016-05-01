var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AmbulanceScheme = new Schema({
  ambulance_id: Number,
  ambulance_service: Number,
  ambulance_location: {
                        lat: Number,
                        lon: Number
  }
});

var Ambulance = mongoose.model('Ambulance', AmbulanceScheme);
module.exports.Ambulance = Ambulance;



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
