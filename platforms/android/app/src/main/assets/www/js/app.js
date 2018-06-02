/*
    Copyright (c) 2018 Keith Gudger All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var currentLatitude = 36.9741;
var currentLongitude = 122.0308

    function initialize_map() {
		console.log("In initalize");
//		directionsService = new google.maps.DirectionsService();
		latlngp = new google.maps.LatLng(currentLatitude, currentLongitude); // using global variable now
        var mapCanvas = document.getElementById('map_canvas');
	    var mapOptions = {
			center: latlngp,
			zoomControl: true,
	        zoomControlOptions: {
	            style: google.maps.ZoomControlStyle.SMALL,
//	          position: google.maps.ControlPosition.LEFT_TOP
		    },
    	    zoom: 16,
    	    mapTypeId: google.maps.MapTypeId.TERRAIN
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

//		buildField(36.655, -121.79, "#FF0000", "1", "Beets");

/*	    var infoWindow;
		var pname;
		var myLatlng;
		var field1Coords = [
			new google.maps.LatLng(36.6502227, -121.7946188),
			new google.maps.LatLng(36.655, -121.7946188),
			new google.maps.LatLng(36.655, -121.79),
			new google.maps.LatLng(36.6502227, -121.79),
			new google.maps.LatLng(36.6502227, -121.7946188)
		];
  // Construct the polygon.
  		cropField1 = new google.maps.Polygon({
		    paths: field1Coords,
		   	strokeColor: '#FF0000',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: '#FF0000',
		    fillOpacity: 0.35,
		    draggable: true,
		    editable: true,
		    geodesic: true
		});
		cropField1.setMap(_map);
		myLatlng = new google.maps.LatLng(36.652, -121.792);
		marker = new google.maps.Marker({
			position: myLatlng,
			map: _map,
			title: 'Current Position'
		});
		marker.setMap(_map);
	    var infoWindow1 = new google.maps.InfoWindow();
		var pname1 = '<div style="color: black;">' + "Field 1<br>" + 
			'date planted: 24 Jan 15<br>' +
			'stock company: MV Seeds<br>' +  
			'lot number: 07bcdi07<br>' +
			'plant type: Beets' +'</div>';
		google.maps.event.addListener(marker, 'click', function() {
  			console.log('Vertex moved on outer path.');
            infoWindow1.setContent(pname1);
        	infoWindow1.open(_map, marker);
		});
*/
//		buildField(36.6449, -121.788, "#00FF00", "2", "Lettuce");

/*		var field2Coords = [
			new google.maps.LatLng(36.6502227, -121.7946188),
			new google.maps.LatLng(36.645, -121.7946188),
			new google.maps.LatLng(36.6449, -121.788),
			new google.maps.LatLng(36.6502227, -121.79),
			new google.maps.LatLng(36.6502227, -121.7946188)
		];
  // Construct the polygon.
  		cropField2 = new google.maps.Polygon({
		    paths: field2Coords,
		   	strokeColor: '#00FF00',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: '#00FF00',
		    fillOpacity: 0.35,
		    draggable: true,
		    editable: true,
		    geodesic: true
		});
		cropField2.setMap(_map);
		myLatlng = new google.maps.LatLng(36.648, -121.792);
		marker = new google.maps.Marker({
			position: myLatlng,
			map: _map,
			title: 'Current Position'
		});
		marker.setMap(_map);
	    var infoWindow2 = new google.maps.InfoWindow();
		var pname2 = '<div style="color: black;">' + "Field 2<br>" + 
			'date planted: 24 Jan 15<br>' +
			'stock company: MV Seeds<br>' +  
			'lot number: 05ecgi05<br>' +
			'plant type: Lettuce' +'</div>';
		google.maps.event.addListener(marker, 'click', function() {
  			console.log('Vertex moved on outer path.');
	        infoWindow2.setContent(pname2);
        	infoWindow2.open(_map, marker);
		});
*/
//		buildField(36.645, -121.80, "#0000FF", "3", "Carrots");

/*		var field3Coords = [
			new google.maps.LatLng(36.6502227, -121.7946188),
			new google.maps.LatLng(36.645, -121.7946188),
			new google.maps.LatLng(36.645, -121.80),
			new google.maps.LatLng(36.6502227, -121.80),
			new google.maps.LatLng(36.6502227, -121.7946188)
		];
  // Construct the polygon.
  		cropField3 = new google.maps.Polygon({
		    paths: field3Coords,
		   	strokeColor: '#0000FF',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: '#0000FF',
		    fillOpacity: 0.35,
		    draggable: true,
		    editable: true,
		    geodesic: true
		});
		cropField3.setMap(_map);
		myLatlng = new google.maps.LatLng(36.648, -121.798);
		marker = new google.maps.Marker({
			position: myLatlng,
			map: _map,
			title: 'Current Position'
		});
		marker.setMap(_map);
	    var infoWindow3 = new google.maps.InfoWindow();
		var pname3 = '<div style="color: black;">' + "Field 3<br>" + 
			'date planted: 24 Jan 15<br>' +
			'stock company: MV Seeds<br>' +  
			'lot number: 08ecbi03<br>' +
			'plant type: Carrots' +'</div>';
		google.maps.event.addListener(marker, 'click', function() {
  			console.log('Vertex moved on outer path.');
	        infoWindow3.setContent(pname3);
        	infoWindow3.open(_map, marker);
		});
*/
//		buildField(36.655, -121.801, "#FFFF00", "4", "Cabbage");

/*		var field4Coords = [
			new google.maps.LatLng(36.6502227, -121.7946188),
			new google.maps.LatLng(36.655, -121.7946188),
			new google.maps.LatLng(36.6551, -121.801),
			new google.maps.LatLng(36.6502227, -121.8),
			new google.maps.LatLng(36.6502227, -121.7946188)
		];
  // Construct the polygon.
  		cropField4 = new google.maps.Polygon({
		    paths: field4Coords,
		   	strokeColor: '#FFFF00',
		    strokeOpacity: 0.8,
		    strokeWeight: 2,
		    fillColor: '#FFFF00',
		    fillOpacity: 0.35,
		    draggable: true,
		    editable: true,
		    geodesic: true
		});
		cropField4.setMap(_map);
		myLatlng = new google.maps.LatLng(36.652, -121.798);
		marker = new google.maps.Marker({
			position: myLatlng,
			map: _map,
			title: 'Current Position'
		});
		marker.setMap(_map);
	    var infoWindow4 = new google.maps.InfoWindow();
		var pname4 = '<div style="color: black;">' + "Field 4<br>" + 
			'date planted: 24 Jan 15<br>' +
			'stock company: MV Seeds<br>' +  
			'lot number: 06ncai01<br>' +
			'plant type: Cabbage' +'</div>';
		google.maps.event.addListener(marker, 'click', function() {
  			console.log('Vertex moved on outer path.');
	        infoWindow4.setContent(pname4);
        	infoWindow4.open(_map, marker);
		});
//		bounds.extend(latlng);
*/
//		document.getElementById("geostat").innerHTML="";
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
