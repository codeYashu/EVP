// Enter values for lat and lon..... i,e. the location of traffic signal
//t is an array consisting of 4 angles in degrees

function LocationPackage(latitude, longitude, theta){
  this.plan = latitude;
  this.plon = longitude;
  this.t = theta;
}

function toradi(num){
    return num*Math.PI/180;
}

function todegree(num){
    return num*180/Math.PI;
}

function newpos(lat,lon) {
    var R = 6371;
    var d = 0.25;
    var ad = d/R;

    var rlat = toradi(lat);
    var rlon = toradi(lon);

    var plat = new Array(4);
    var plon = new Array(4);

    var t = [90, 180, 270, 360];

    for(i=0;i<4;i++){
        var rt = toradi(t[i]);
        plat[i] = Math.asin((Math.sin(rlat) * Math.cos(ad)) + (Math.cos(rlat) * Math.sin(ad) * Math.cos(rt)));
        plon[i] = rlon + Math.atan2((Math.sin(rt) * Math.sin(ad) * Math.cos(rlat)) , (Math.cos(ad) - Math.sin(rlat) * Math.sin(plat[i])));
    }

    for(i=0;i<4;i++){
        plat[i] = todegree(plat[i]);
        plon[i] = todegree(plon[i]);
    }

    var location = new LocationPackage(plat, plon, t);

    console.log(plat);
    console.log(plon);
    console.log(t);
    return {plat:plat,
            plon:plon,
            t:t,};
}

module.exports.LocationPackage = LocationPackage;
module.exports.newPos = newpos;
