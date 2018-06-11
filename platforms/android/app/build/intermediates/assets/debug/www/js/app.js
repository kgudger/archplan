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

function consoLog(message) {
	if (debug) 
		console.log(message);
}

consoLog("In app.js");

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


	function handleNoGeolocation(errorFlag) {
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
		    var content = 'Error: Your browser doesn\'t support geolocation.';
		}
		var options = {
			map: _map,
			position: new google.maps.LatLng(60, 105),content: content
			};

		var infowindow = new google.maps.InfoWindow(options);
		_map.setCenter(options.position);
		document.getElementById("geostat").innerHTML=content;
	};

    //Success callback
	/**
	 *	function to set current latitude and longitude from GPS
	 *	@param p is passed from intel library function
	 */
	var suc = function(p) {
//	    consoLog("geolocation success", 4);
	    //Draws the map initially
    	currentLatitude = p.coords.latitude;
    	currentLongitude = p.coords.longitude;
		initialize();
	};
	/**
	 *	fail function for intel gps routine - does nothing 
	 */			    
	var fail = function() {
	    consoLog("Geolocation failed. \nPlease enable GPS in Settings.", 1);
		document.getElementById("geostat").innerHTML="Geolocation failed. \nPlease enable GPS in Settings.";
	};

/**	updateMap
 *	
 *	@param features is from AJAX call
 */
	function updateMap(features) {
	  document.getElementById("add_place").innerHTML=features['Address'];
	  document.getElementById("apn_place").innerHTML=features['APN'];
	  document.getElementById("zone_place").innerHTML=features['Zoning1'];
	  document.getElementById("lot_place").innerHTML=features['ParcelSizeSqFt']+ "Sq. Ft.";
	  geocoder = new google.maps.Geocoder();
      if (geocoder) {
       geocoder.geocode( { 'address': features['Address']}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
			consoLog("Geocode OK" + results[0].geometry.location);
          _map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow(
                { content: "<a href='http://feasibuild.tk/images/129R.png'>Setbacks</a>" ,
                  size: new google.maps.Size(150,50)
                });

            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: _map, 
                title:features['Address']
            }); 
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(_map,marker);
            });
            var apnnd = features['APN']
            apnnd = apnnd.replace(/-/g, '')
 			consoLog("APN " + apnnd);
            getPoly(apnnd)

          } else {
            alert("No results found");
          }
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  }		
  
var cropField ;
var reducedPoly ;

/**	updatePoly
 *	
 *	@param features from AJAX call
 */
	function updatePoly(features) {
		var fieldCoords = [];
		var arrayLength = features.length;
		var property1 = [] ;
		for (var i = 0; i < arrayLength; i++) {
			consoLog("1=" + features[i][1] + " 0= " + features[i][0]);
			fieldCoords.push(new google.maps.LatLng(features[i][1], features[i][0]));
			property1.push(new Vector2(features[i][1], features[i][0]));
		}

  // Construct the polygon.
		if (typeof cropField !== 'undefined') { cropField.setMap(null); }
  		cropField = new google.maps.Polygon({
		    paths: fieldCoords,
		   	strokeColor: '#14EEFE',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: 1,
		    fillOpacity: 0.0,
		    draggable: false,
		    editable: false,
		    geodesic: true
		});
		cropField.setMap(_map);
//		New smaller polygon goes here
		fieldCoords = [];
		if (typeof reducedPoly !== 'undefined') { reducedPoly.setMap(null); }
		var fieldCoords2 = inflatePolygon(property1, s1side * -2.74319999583e-6); // 10 feet
		arrayLength = fieldCoords2.length;
		for (var i = 0; i < arrayLength; i++) {
			consoLog("X =" + fieldCoords2[i].x + " Y = " + fieldCoords2[i].y);
			fieldCoords.push(new google.maps.LatLng(fieldCoords2[i].x.toString(),
				fieldCoords2[i].y.toString()));
		}
		
  		reducedPoly = new google.maps.Polygon({
		    paths: fieldCoords,
		   	strokeColor: '#ec494c',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: 1,
		    fillOpacity: 0.0,
		    draggable: false,
		    editable: false,
		    geodesic: true
		});
		reducedPoly.setMap(_map);

  }		

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


/** sendfunc
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param params is GET request string
 */
function sendfunc() {
    var xmlhttp;
	var address = document.getElementById("address").value
//	address += " Santa Cruz CA";
	address = encodeURI(address);
	consoLog("Address is " + address);
	try {
	   xmlhttp=new XMLHttpRequest();
    } catch(e) {
        xmlhttp = false;
        consoLog(e);
    }
	if (xmlhttp) {
        xmlhttp.onreadystatechange=function() {
		  if (xmlhttp.readyState==4)
		  {  if ( (xmlhttp.status==200) || (xmlhttp.status==0) )
            {
              returnedList = (xmlhttp.responseText);
              returnedList = JSON.parse(returnedList);
              var features = returnedList['features']['0']['attributes'];
              consoLog(features);
              var zone = features['Zoning1'];
              zone = zone.split(" ");
              consoLog("zone is " + zone[0]);
              getZones(zone[0]);
              updateMap(features);
			}
		  }
		};
	}
	xmlhttp.open("GET","https://vw8.cityofsantacruz.com/server/rest/services/search/MapServer/0/query?f=json&where=Upper(Address)%20LIKE%20Upper(%27%25" + address + "%25%27)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=Address%2CSiteAdd2%2CAPN%2CUseCode%2CParcelSizeSqFt%2CCOASTALZ%2CZoning1&outSR=102643", true);
	xmlhttp.send(null);
}; // sendfunc

/** getPoly
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param apn is APN from previous AJAX function
 */
function getPoly(apn) {
    var xmlhttp;
	consoLog("APN is " + apn);
	try {
	   xmlhttp=new XMLHttpRequest();
    } catch(e) {
        xmlhttp = false;
        consoLog(e);
    }
	if (xmlhttp) {
        xmlhttp.onreadystatechange=function() {
		  if (xmlhttp.readyState==4)
		  {  if ( (xmlhttp.status==200) || (xmlhttp.status==0) )
            {
              returnedList = (xmlhttp.responseText);
              returnedList = JSON.parse(returnedList);
              var features = returnedList['features']['0']['geometry']['rings']['0'];
              consoLog(features);
              updatePoly(features);
			}
		  }
		};
	}
	xmlhttp.open("GET","https://gis.co.santa-cruz.ca.us/sccgis/rest/services/OpenData_Build_Single/MapServer/145/query?where=APNNODASH%20%3D%20%27" + apn + "%27&outFields=GP_LANDUSE&outSR=4326&f=json", true);
	xmlhttp.send(null);
}; // getPoly

/** getZones
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param zone is zoning designation for call to db
 */
function getZones(zone) {
    var xmlhttp;
	consoLog("Zone is " + zone);
	try {
	   xmlhttp=new XMLHttpRequest();
    } catch(e) {
        xmlhttp = false;
        consoLog(e);
    }
	if (xmlhttp) {
        xmlhttp.onreadystatechange=function() {
		  if (xmlhttp.readyState==4)
		  {  if ( (xmlhttp.status==200) || (xmlhttp.status==0) )
            {
              returnedList = (xmlhttp.responseText);
              returnedList = JSON.parse(returnedList);
              consoLog(returnedList);
              document.getElementById("fset_place").innerHTML=returnedList['sfront'];
              document.getElementById("rset_place").innerHTML=returnedList['srear'];
              document.getElementById("sset_place").innerHTML=returnedList['s1side'];
              s1side = returnedList['s1side'];
			  document.getElementById("mbuild_place").innerHTML=returnedList['maxbuild'];
			  document.getElementById("mheight_place").innerHTML=returnedList['pheight'];
			  document.getElementById("mstories_place").innerHTML=returnedList['pstories'];
			}
		  }
		};
	}
	xmlhttp.open("GET","http://feasibuild.tk/server.php?command=getZone&zone=" + zone, true);
	xmlhttp.send(null);
}; // getZones
