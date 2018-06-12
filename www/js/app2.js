/*
    Copyright (c) 2018 Keith Gudger All rights reserved. Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/** Object for functions for getting apn and zoning
 *  index is district
 */

var getAPN = {
	CityofSantaCruz    : function(muni) { sendfunc(muni); },
	CountyofSantaCruz  : function(muni) { sendfunc(muni); },
	CityofCapitola     : function(muni) { sendfunc(muni); },
	CityofWatsonville  : function(muni) { sendfunc(muni); },
	CityofScottsValley : function(muni) { sendfunc(muni); }
};

/** sendfunc
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param muni is municipality
 */
function sendfunc(muni) {
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
              getZones(muni, zone[0]);
              updateMap(features);
			}
		  }
		};
	}
	xmlhttp.open("GET","https://vw8.cityofsantacruz.com/server/rest/services/search/MapServer/0/query?f=json&where=Upper(Address)%20LIKE%20Upper(%27%25" + address + "%25%27)&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=Address%2CSiteAdd2%2CAPN%2CUseCode%2CParcelSizeSqFt%2CCOASTALZ%2CZoning1&outSR=102643", true);
	xmlhttp.send(null);
}; // sendfunc

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
/*
            var infowindow = new google.maps.InfoWindow(
                { content: "<a href='http://feasibuild.tk/images/129R.png'>Setbacks</a>" ,
                  size: new google.maps.Size(150,50)
                });
*/
            var marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: _map, 
                title:features['Address']
            }); 
/*
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(_map,marker);
            });
*/
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

/** getZones
 *	"Ajax" function that sends and processes xmlhttp request
 *	@param zone is zoning designation for call to db
 */
function getZones(muni,zone) {
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
	xmlhttp.open("GET","http://feasibuild.tk/server.php?command=getZone&muni=" + muni + "&zone=" + zone, true);
	xmlhttp.send(null);
}; // getZones
