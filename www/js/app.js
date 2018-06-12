/*
    Copyright (c) 2018 Keith Gudger All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var currentLatitude = 0;
var currentLongitude = 0;
var options = {			// GPS options
    timeout: 5000,
    maximumAge: 20000,
    enableHighAccuracy: true
};
var geocoder;
var mapCanvas;
var _map ;
var s1side = 0 ;
var debug = true;

var cropField ; // initial outline polygon
var reducedPoly ; // reduced by setbacks polygon

function consoLog(message) {
	if (debug) 
		console.log(message);
}

consoLog("In app.js");

/**
 *	Fires when DOM page loaded
 */
function initialize_map() {
	consoLog("In initalize");
	mapCanvas = document.getElementById('map_canvas');
	ready();
};

/**
 *	Fires when DOM page loaded
 */
function ready() {
    if (navigator.geolocation) {
		var location_timeout = setTimeout("defaultPosition()", 2000);
		// changed to 2 seconds 
        navigator.geolocation.getCurrentPosition(
			function(pos) { clearTimeout(location_timeout); showPosition(pos); },
			function(err) {
				clearTimeout(location_timeout);
				console.warn('ERROR(' + err.code + '): ' + err.message);
				defaultPosition()
			},
			options
		);
    }
    else {
		console.warn("Geolocation failed. \nPlease enable GPS in Settings.", 1);
		defaultPosition();
	}
}

/** 
 *	sets current latitude and longitude from ready() function
 */
function showPosition(position) {
    currentLatitude = position.coords.latitude;
	currentLongitude = position.coords.longitude;
    consoLog("Lat is " + currentLatitude + " Lon is " + currentLongitude);
    showMap();
};

/** 
 *	on fail from ready, default position
 */
function defaultPosition() {
	currentLatitude = 36.9741;
	currentLongitude = -122.0308
    consoLog("In defaultPosition Lat is " + currentLatitude + " Lon is " + currentLongitude);
    showMap();
}

/**
 *	showMap shows map after geolocation decided.
 */
function showMap() {
		var latlngp = new google.maps.LatLng(currentLatitude, currentLongitude); // using global variable now
	    var mapOptions = {
			center: latlngp,
			zoomControl: true,
	        zoomControlOptions: {
//	            style: google.maps.ZoomControlStyle.SMALL,
//	          position: google.maps.ControlPosition.LEFT_TOP
		    },
    	    zoom: 20,
    	    mapTypeId: google.maps.MapTypeId.roadmap
    	};
        _map = new google.maps.Map(mapCanvas, mapOptions);
		var marker = new google.maps.Marker({
			position: latlngp,
			map: _map,
			title: 'Current Position'
		});
		marker.setMap(_map);
} // showMap

/** vectorCoordinates2JTS 
 * @param polygon is polygon to push coordinates into object
 */
function vectorCoordinates2JTS (polygon) {
  var coordinates = [];

  for (var i = 0; i < polygon.length; i++) {
    coordinates.push(new jsts.geom.Coordinate(polygon[i].x, polygon[i].y));
    consoLog("X = " + coordinates[i].x + " and Y = " + coordinates[i].y);
  }
  return coordinates;
}

/** inflatePolygon
 * @param poly
 * @param spacing
 */
function inflatePolygon(poly, spacing)
{
  var geoInput = vectorCoordinates2JTS(poly);
  geoInput.push(geoInput[0]);
  consoLog("geoInput " + geoInput[0].x);

  var geometryFactory = new jsts.geom.GeometryFactory();

  try {
	var shell = geometryFactory.createPolygon(geoInput);
    consoLog("shell is " + shell);
  }
  catch(err) {
    consoLog("Error is " + err.message);
  }

  try {
    var polygon = shell.buffer(spacing, jsts.operation.buffer.BufferParameters.CAP_FLAT);
    consoLog("poly is " + polygon);
  }
  catch(err) {
    consoLog("Error is " + err.message);
  }

  var inflatedCoordinates = [];
  var oCoordinates;
  oCoordinates = polygon.shell.points.coordinates;
  for (i = 0; i < oCoordinates.length; i++) {
    var oItem;
    oItem = oCoordinates[i];
    inflatedCoordinates.push(new google.maps.LatLng(oItem.x, oItem.y));
    consoLog("iX,Y = " + oItem.x + " and iY = " + oItem.y);
  }
  return oCoordinates ; //inflatedCoordinates;
}

/** Vector2
 *  @param x is x
 *  @param y is y
 *  @return object with .x and .y
 */
function Vector2(x, y) 
{
    this.x = x;
    this.y = y;
}

/** getProp
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param params is GET request string
 */
function getProp() {
	var muni = document.getElementById("city").value;
	consoLog("Muni is " + muni);
	getAPN[muni](muni);
} // getProp

