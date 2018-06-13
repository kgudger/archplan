/*
    Copyright (c) 2018 Keith Gudger All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
var p_address ; // global variable for send functions
var p_apnnd ; // global variable for send functions

/** Object for functions for getting apn and zoning
 *  index is district
 */

var getAPN = {
	CityofSantaCruz    : { 
		sendFunc : function(muni,address) { sendfunc(muni,
			"https://vw8.cityofsantacruz.com/server/rest/services/search/MapServer/0/query?f=json&where=Upper(Address)%20LIKE%20Upper(%27%25" + address + "%25%27)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=Address%2CSiteAdd2%2CAPN%2CUseCode%2CParcelSizeSqFt%2CCOASTALZ%2CZoning1&outSR=102643",
			this.zoneFunc); },
		zoneFunc : function(muni,returnedList) { getZonesSCi(muni, returnedList); },
		siteFunc : function(muni,returnedList) { updateSiteSCi(muni, returnedList); },
		polyFunc : function(muni,returnedList) { updatePolySCi(muni, returnedList); }
	},
	CountyofSantaCruz  : { 
		sendFunc : function(muni,address) { consoLog("http://gis.co.santa-cruz.ca.us/sccgis/rest/services/GISwebLocator/GeocodeServer/findAddressCandidates?Single%20Line%20Input=" + encodeURI(address) + "&f=json&outFields=*");
				sendfunc(muni,
			"http://gis.co.santa-cruz.ca.us/sccgis/rest/services/GISwebLocator/GeocodeServer/findAddressCandidates?Single%20Line%20Input=" + address + "&f=json&outFields=*",
			this.apiFunc); },
		apiFunc  : function(muni,returnedList) { getAPNSCo(muni, returnedList); },
		zoneFunc : function(muni,returnedList) { getZonesSCo(muni, returnedList); },
		siteFunc : function(muni,returnedList) { updateSiteSCi(muni, returnedList); },
		polyFunc : function(muni,returnedList) { updatePolySCi(muni, returnedList); }
	},

	CityofCapitola     : function(muni,address) { sendfunc(muni,address); },
	CityofWatsonville  : function(muni,address) { sendfunc(muni,address); },
	CityofScottsValley : function(muni,address) { sendfunc(muni,address); }
};

/** sendHTTP
 *	"Ajax" function that sends and processes xmlhttp request
	var address = document.getElementById("address").value
	address = encodeURI(address);
	consoLog("Address is " + address);
	urlin = "https://vw8.cityofsantacruz.com/server/rest/services/search/MapServer/0/query?f=json&where=Upper(Address)%20LIKE%20Upper(%27%25" + address + "%25%27)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=Address%2CSiteAdd2%2CAPN%2CUseCode%2CParcelSizeSqFt%2CCOASTALZ%2CZoning1&outSR=102643"
 *	@param muni is municipality
 */
function sendHTTP(urlin,retFun,nextCall) {
    var xmlhttp;
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
              retFun(features);
/*              var zone = features['Zoning1'];
              zone = zone.split(" ");
              consoLog("zone is " + zone[0]);
              getZones(muni, zone[0]);
              updateMap(features);*/
			}
		  }
		};
	}
	xmlhttp.open("GET",urlin, true);
	xmlhttp.send(null);
}; // sendfunc

/** sendfunc
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param muni is municipality
 */
function sendfunc(muni, address, nextCall) {
    var xmlhttp;
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
              nextCall(muni,returnedList);
/*              var features = returnedList['features']['0']['attributes'];
              consoLog(features);
              var zone = features['Zoning1'];
              zone = zone.split(" ");
              consoLog("zone is " + zone[0]);
              getZones(muni, zone[0]);
              updateMap(features); */
			}
		  }
		};
	}
	xmlhttp.open("GET", address, true);
	xmlhttp.send(null);
}; // sendfunc

/**	updateMap
 *	
 *	@param features is from AJAX call
 */
	function updateMap() {
	  geocoder = new google.maps.Geocoder();
      if (geocoder) {
       geocoder.geocode( { 'address': p_address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
			consoLog("Geocode OK" + results[0].geometry.location);
          _map.setCenter(results[0].geometry.location);
/*
            var infowindow = new google.maps.InfoWindow(
                { content: "<a href='http://feasibuild.tk/images/129R.png'>Setbacks</a>" ,
                  size: new google.maps.Size(150,50)
                });
*/
            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: _map, 
                title:p_address
            }); 
/*
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(_map,marker);
            });

*/
          } else {
            alert("No results found");
          }
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  }		
  
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

/** getZonesSCi
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param muni is minicipality in db
 *	@param zone is zoning designation for call to db
 *	@param zone is zoning designation for call to db
 */
function getZonesSCi(muni, returnedList) {
	var features = returnedList['features']['0']['attributes'];
    consoLog(features);
	document.getElementById("add_place").innerHTML=features['Address'];
	document.getElementById("apn_place").innerHTML=features['APN'];
	document.getElementById("zone_place").innerHTML=features['Zoning1'];
	document.getElementById("lot_place").innerHTML=features['ParcelSizeSqFt']+ "Sq. Ft.";
    var zone = features['Zoning1'];
    zone = zone.split(" ");
    var nzone = zone[0];
    p_address = features['Address'] + " " + features['SiteAdd2'];
    p_apnnd = features['APN']
    var urlz = "http://feasibuild.tk/server.php?command=getZone&muni=" + muni + "&zone=" + nzone ;
	consoLog("Zone is " + nzone);
//	getZones(muni, urlz, address, apnnd);
	sendfunc(muni, urlz, getAPN[muni].siteFunc);
}; // getZonesSCi

/** getZones
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param zone is zoning designation for call to db
 */
function getZones(muni,urlz, address, apnnd) {
    var xmlhttp;
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
              var returnedList = (xmlhttp.responseText);
              returnedList = JSON.parse(returnedList);
              consoLog(returnedList);
              document.getElementById("fset_place").innerHTML=returnedList['sfront'];
              document.getElementById("rset_place").innerHTML=returnedList['srear'];
              document.getElementById("sset_place").innerHTML=returnedList['s1side'];
              s1side = returnedList['s1side'];
			  document.getElementById("mbuild_place").innerHTML=returnedList['maxbuild'];
			  document.getElementById("mheight_place").innerHTML=returnedList['pheight'];
			  document.getElementById("mstories_place").innerHTML=returnedList['pstories'];
			  updateMap(address,apnnd);
			}
		  }
		};
	}
	xmlhttp.open("GET",urlz, true);
	xmlhttp.send(null);
}; // getZones

function updateSiteSCi(muni, returnedList) {

	consoLog(returnedList);
    document.getElementById("fset_place").innerHTML=returnedList['sfront'];
    document.getElementById("rset_place").innerHTML=returnedList['srear'];
    document.getElementById("sset_place").innerHTML=returnedList['s1side'];
    s1side = returnedList['s1side']; // global variable
	document.getElementById("mbuild_place").innerHTML=returnedList['maxbuild'];
	document.getElementById("mheight_place").innerHTML=returnedList['pheight'];
	document.getElementById("mstories_place").innerHTML=returnedList['pstories'];

    p_apnnd = p_apnnd.replace(/-/g, '')
	urlz = "https://gis.co.santa-cruz.ca.us/sccgis/rest/services/OpenData_Build_Single/MapServer/145/query?where=APNNODASH%20%3D%20%27" + p_apnnd + "%27&outFields=GP_LANDUSE&outSR=4326&f=json"
	sendfunc(muni, urlz, getAPN[muni].polyFunc);
//	updateMap(p_address,p_apnnd);
} // updateSiteSCi

function updatePolySCi(muni, returnedList) {

    var features = returnedList['features']['0']['geometry']['rings']['0'];
    consoLog(features);
	var fieldCoords = [];
	var arrayLength = features.length;
	var property1 = [] ;
	for (var i = 0; i < arrayLength; i++) {
		consoLog("1=" + features[i][1] + " 0= " + features[i][0]);
		fieldCoords.push(new google.maps.LatLng(features[i][1], features[i][0]));
		property1.push(new Vector2(features[i][1], features[i][0]));
	}

  // Construct the polygon.
  addPoly2Map(fieldCoords, cropField, '#14EEFE');
//		New smaller polygon goes here
	fieldCoords = [];
	var fieldCoords2 = inflatePolygon(property1, s1side * -2.74319999583e-6); // 10 feet
	arrayLength = fieldCoords2.length;
	for (var i = 0; i < arrayLength; i++) {
		consoLog("X =" + fieldCoords2[i].x + " Y = " + fieldCoords2[i].y);
		fieldCoords.push(new google.maps.LatLng(fieldCoords2[i].x.toString(),
			fieldCoords2[i].y.toString()));
	}

    addPoly2Map(fieldCoords, reducedPoly, '#ec494c');
	updateMap(p_address,p_apnnd);
} // updatePolySCi

function addPoly2Map(fieldCoords, cropfield, color, ) {
  // Construct the polygon.
	if (typeof cropfield !== 'undefined') { cropfield.setMap(null); }
  	cropfield = new google.maps.Polygon({
	    paths: fieldCoords,
	   	strokeColor: color,
	    strokeOpacity: 0.8,
	    strokeWeight: 2,
	    fillColor: 1,
	    fillOpacity: 0.0,
	    draggable: false,
	    editable: false,
	    geodesic: true
	});
	cropfield.setMap(_map);
} // addPoly2Map

/** getAPNSCo
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param muni is minicipality in db
 *	@param zone is zoning designation for call to db
 *	@param zone is zoning designation for call to db
 */
function getAPNSCo(muni, returnedList) {
    consoLog(returnedList);
	var features = returnedList['candidates']['0']['attributes'];
    consoLog(features);
    p_address = features['House'] + " " + features['PreDir'] + " " + features['StreetName'] + features['SufType'];
	document.getElementById("add_place").innerHTML=p_address;
    var urlz = "https://gis.co.santa-cruz.ca.us/sccgis/rest/services/OpenData_Build_Single/MapServer/145/query?where=SITEADD%20LIKE%20UPPER%28%20%272376%20N%20RODEO%20GULCH%20RD%27%29&outFields=APNNODASH,SQUAREFT,SITEADD,SITEADD2,ZONING,NAME&outSR=4326&f=json" ;
//	consoLog("Zone is " + nzone);
	sendfunc(muni, urlz, getAPN[muni].zoneFunc);
}; // getAPNSCo

/** getZonesSCo
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param muni is minicipality in db
 *	@param zone is zoning designation for call to db
 *	@param zone is zoning designation for call to db
 */
function getZonesSCo(muni, returnedList) {
    consoLog(returnedList);
	var features = returnedList['features']['0']['attributes'];
	document.getElementById("apn_place").innerHTML=features['APNNODASH'];
	document.getElementById("zone_place").innerHTML=features['ZONING'];
	document.getElementById("lot_place").innerHTML=features['SQUAREFT']+ "Sq. Ft.";
    var zone = features['ZONING'];
    zone = zone.split(" ");
    var nzone = zone[0];
    p_apnnd = features['APNNODASH']
    var urlz = "http://feasibuild.tk/server.php?command=getZone&muni=" + muni + "&zone=" + nzone ;
	consoLog("Zone is " + nzone);
//	getZones(muni, urlz, address, apnnd);
	sendfunc(muni, urlz, getAPN[muni].siteFunc);
}; // getZonesSCo

