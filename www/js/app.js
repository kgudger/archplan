/*
    Copyright (c) 2018 Keith Gudger All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var currentLatitude = 36.9741;
var currentLongitude = -122.0308
var geocoder;
var mapCanvas = document.getElementById('map_canvas');
var _map ;

console.log("In app.js");

    function initialize_map() {
		console.log("In initalize");
//		directionsService = new google.maps.DirectionsService();
		latlngp = new google.maps.LatLng(currentLatitude, currentLongitude); // using global variable now
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
//		setTimeout("$('#map_canvas').gmap('refresh')",500);
/*		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsDisplay.setMap(_map);
		directionsDisplay.setPanel(document.getElementById('natsinglelist'));*/
		var marker = new google.maps.Marker({
			position: latlngp,
			map: _map,
			title: 'Current Position'
		});
		marker.setMap(_map);

	};

/**	buildField
 *	builds field from lat lon
 *
 *	@param latitude is farthest latitude from center
 *	@param longitude is farthest longitude from center
 *	@param color is color of polygon
 *	@param cname is name of field
 *	@param crop is crop type
 */
	function buildField(latitude, longitude, color, cname, crop) {
		var fieldCoords = [
			new google.maps.LatLng(36.6502227, -121.7946188),
			new google.maps.LatLng(latitude, -121.7946188),
			new google.maps.LatLng(latitude, longitude),
			new google.maps.LatLng(36.6502227, longitude),
			new google.maps.LatLng(36.6502227, -121.7946188)
		];

  // Construct the polygon.
  		var cropField = new google.maps.Polygon({
		    paths: fieldCoords,
		   	strokeColor: color,
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: color,
		    fillOpacity: 0.35,
		    draggable: true,
		    editable: true,
		    geodesic: true
		});

		cropField.setMap(_map);

		var latavg = ((latitude - 36.650227) / 2) + 36.650227 ;
		var lonavg = ((longitude - (-121.7946188)) / 2) - 121.7946188 ;
		var myLatlng = new google.maps.LatLng(latavg,lonavg);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: _map,
			title: 'Current Position'
		});
		marker.setMap(_map);
	    var infoWindow = new google.maps.InfoWindow();
		var pname = '<div style="color: black;">' + "Field " + cname + "<br>" + 
			'date planted: 24 Jan 15<br>' +
			'stock company: MV Seeds<br>' +  
			'lot number: 06ncai01<br>' +
			'plant type: ' + crop +'</div>';
		google.maps.event.addListener(marker, 'click', function() {
  			console.log('Vertex moved on outer path.');
	        infoWindow.setContent(pname);
        	infoWindow.open(_map, marker);
		});
	};

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
//	    console.log("geolocation success", 4);
	    //Draws the map initially
    	currentLatitude = p.coords.latitude;
    	currentLongitude = p.coords.longitude;
		initialize();
	};
	/**
	 *	fail function for intel gps routine - does nothing 
	 */			    
	var fail = function() {
	    console.log("Geolocation failed. \nPlease enable GPS in Settings.", 1);
		document.getElementById("geostat").innerHTML="Geolocation failed. \nPlease enable GPS in Settings.";
	};

/**	updateMap
 *	
 *	@param latitude is farthest latitude from center
 *	@param longitude is farthest longitude from center
 *	@param color is color of polygon
 *	@param cname is name of field
 *	@param crop is crop type
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
			console.log("Geocode OK" + results[0].geometry.location);
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
 			console.log("APN " + apnnd);
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
 *	@param latitude is farthest latitude from center
 *	@param longitude is farthest longitude from center
 *	@param color is color of polygon
 *	@param cname is name of field
 *	@param crop is crop type
 */
	function updatePoly(features) {
		var fieldCoords = [];
		var arrayLength = features.length;
		var property1 = [] ;
		for (var i = 0; i < arrayLength; i++) {
			console.log("1=" + features[i][1] + " 0= " + features[i][0]);
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
		var fieldCoords2 = inflatePolygon(property1, -2.74319999583e-5); // 10 feet
		arrayLength = fieldCoords2.length;
		for (var i = 0; i < arrayLength; i++) {
			console.log("X =" + fieldCoords2[i].x + " Y = " + fieldCoords2[i].y);
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

function vectorCoordinates2JTS (polygon) {
  var coordinates = [];

  for (var i = 0; i < polygon.length; i++) {
    coordinates.push(new jsts.geom.Coordinate(polygon[i].x, polygon[i].y));
    console.log("X = " + coordinates[i].x + " and Y = " + coordinates[i].y);
  }
  return coordinates;
}

function inflatePolygon(poly, spacing)
{
  var geoInput = vectorCoordinates2JTS(poly);
  geoInput.push(geoInput[0]);
  console.log("geoInput " + geoInput[0].x);

  var geometryFactory = new jsts.geom.GeometryFactory();

  try {
	var shell = geometryFactory.createPolygon(geoInput);
    console.log("shell is " + shell);
  }
  catch(err) {
    console.log("Error is " + err.message);
  }

  try {
    var polygon = shell.buffer(spacing, jsts.operation.buffer.BufferParameters.CAP_FLAT);
    console.log("poly is " + polygon);
  }
  catch(err) {
    console.log("Error is " + err.message);
  }

  var inflatedCoordinates = [];
  var oCoordinates;
  oCoordinates = polygon.shell.points.coordinates;
  for (i = 0; i < oCoordinates.length; i++) {
    var oItem;
    oItem = oCoordinates[i];
    inflatedCoordinates.push(new google.maps.LatLng(oItem.x, oItem.y));
    console.log("iX,Y = " + oItem.x + " and iY = " + oItem.y);
  }
  return oCoordinates ; //inflatedCoordinates;
}
/*
var property1 = [
	new Vector2(36.9530434040848,   -122.03296429697015),
	new Vector2(36.95296468651526,  -122.03368781492003),
	new Vector2(36.953773541799656, -122.03382895603836),
	new Vector2(36.953826315585516, -122.03329982113146),
	new Vector2(36.95362253861876,  -122.03326626425898),
	new Vector2(36.95363807256827,  -122.03311978038441),
	new Vector2(36.95357078962553,  -122.03310783112806),
	new Vector2(36.953581522214364, -122.03301982319464),
	new Vector2(36.95340744275806,  -122.03298593217909),
	new Vector2(36.953403543286235, -122.03301802809266),
	new Vector2(36.953125713309255, -122.0329765775434),
	new Vector2(36.9530434040848,   -122.03296429697015)
];*/
function Vector2(x, y) 
{
    this.x = x;
    this.y = y;
}


/**
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param params is GET request string
 */
function sendfunc() {
    var xmlhttp;
	var address = document.getElementById("address").value
//	address += " Santa Cruz CA";
	address = encodeURI(address);
	console.log("Address is " + address);
	try {
	   xmlhttp=new XMLHttpRequest();
    } catch(e) {
        xmlhttp = false;
        console.log(e);
    }
	if (xmlhttp) {
        xmlhttp.onreadystatechange=function() {
		  if (xmlhttp.readyState==4)
		  {  if ( (xmlhttp.status==200) || (xmlhttp.status==0) )
            {
              returnedList = (xmlhttp.responseText);
              returnedList = JSON.parse(returnedList);
              var features = returnedList['features']['0']['attributes'];
              console.log(features);
              var zone = features['Zoning1'];
              zone = zone.split(" ");
              console.log("zone is " + zone[0]);
              getZones(zone[0]);
              updateMap(features);
			}
		  }
		};
	}
	xmlhttp.open("GET","https://vw8.cityofsantacruz.com/server/rest/services/search/MapServer/0/query?f=json&where=Upper(Address)%20LIKE%20Upper(%27%25" + address + "%25%27)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=Address%2CSiteAdd2%2CAPN%2CUseCode%2CParcelSizeSqFt%2CCOASTALZ%2CZoning1&outSR=102643", true);
	xmlhttp.send(null);
/*      xmlhttp.setRequestHeader ("Accept", "text/plain");
	  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlhttp.send(params);*/
}; // sendfunc

/**
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param params is GET request string
 */
function getPoly(apn) {
    var xmlhttp;
	console.log("APN is " + apn);
	try {
	   xmlhttp=new XMLHttpRequest();
    } catch(e) {
        xmlhttp = false;
        console.log(e);
    }
	if (xmlhttp) {
        xmlhttp.onreadystatechange=function() {
		  if (xmlhttp.readyState==4)
		  {  if ( (xmlhttp.status==200) || (xmlhttp.status==0) )
            {
              returnedList = (xmlhttp.responseText);
              returnedList = JSON.parse(returnedList);
              var features = returnedList['features']['0']['geometry']['rings']['0'];
              console.log(features);
/*              var zone = features['Zoning1'];
              zone = zone.split(" ");
              console.log("zone is " + zone[0]);
              getZones(zone[0]);*/
              updatePoly(features);
			}
		  }
		};
	}
	xmlhttp.open("GET","https://gis.co.santa-cruz.ca.us/sccgis/rest/services/OpenData_Build_Single/MapServer/145/query?where=APNNODASH%20%3D%20%27" + apn + "%27&outFields=GP_LANDUSE&outSR=4326&f=json", true);
	xmlhttp.send(null);
/*      xmlhttp.setRequestHeader ("Accept", "text/plain");
	  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlhttp.send(params);*/
}; // getPoly

/**
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param params is GET request string
 */
function getZones(zone) {
    var xmlhttp;
	console.log("Zone is " + zone);
	try {
	   xmlhttp=new XMLHttpRequest();
    } catch(e) {
        xmlhttp = false;
        console.log(e);
    }
	if (xmlhttp) {
        xmlhttp.onreadystatechange=function() {
		  if (xmlhttp.readyState==4)
		  {  if ( (xmlhttp.status==200) || (xmlhttp.status==0) )
            {
              returnedList = (xmlhttp.responseText);
              returnedList = JSON.parse(returnedList);
              console.log(returnedList);
              document.getElementById("fset_place").innerHTML=returnedList['sfront'];
              document.getElementById("rset_place").innerHTML=returnedList['srear'];
              document.getElementById("sset_place").innerHTML=returnedList['s1side'];
			  document.getElementById("mbuild_place").innerHTML=returnedList['maxbuild'];
			  document.getElementById("mheight_place").innerHTML=returnedList['pheight'];
			  document.getElementById("mstories_place").innerHTML=returnedList['pstories'];
			}
		  }
		};
	}
	xmlhttp.open("GET","http://feasibuild.tk/server.php?command=getZone&zone=" + zone, true);
	xmlhttp.send(null);
/*      xmlhttp.setRequestHeader ("Accept", "text/plain");
	  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlhttp.send(params);*/
}; // getZones
