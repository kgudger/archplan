/* Test of geometry factory functions
 * 364537.766667 is feet per degree of lat / long
 * 2.74319999583e-06 is degree lat / lon per foot
 */

function Vector2(x, y) 
{
    this.x = x;
    this.y = y;
}

var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");
var poly = [
    new Vector2(150.5, 170),
    new Vector2(400.5, 120),
    new Vector2(200.5, 270),
    new Vector2(350.5, 400),
    new Vector2(210.5, 470)
];

/* */
// Regular rectangle
var poly_rect = [
    new Vector2(50, 50),
    new Vector2(125, 50),
    new Vector2(125, 100),
    new Vector2(50, 100)
];
/* */
/* */
// Rotated rectangle
var rotated_poly_rect = [
    new Vector2(250, 20),
    new Vector2(300, 70),
    new Vector2(250, 120),
    new Vector2(200, 70)
];
/* */
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
];
draw(property1,"#00FF00");
draw(inflatePolygon(property1, -2.74319999583e-5),"#FF0000");

draw(poly,"#000000");
draw(inflatePolygon(poly, -10),"#FF0000");

draw(poly_rect,"#000000");
draw(inflatePolygon(poly_rect, -10),"#FF0000");

draw(rotated_poly_rect,"#000000");
draw(inflatePolygon(rotated_poly_rect, -10),"#FF0000");


function draw(p,color) {
	ctx.beginPath();
	ctx.moveTo(p[0].x, p[0].y);
	for(var i = 1; i < p.length; i++)
	{
		ctx.lineTo(p[i].x, p[i].y);
	}
	ctx.strokeStyle = color;
	ctx.closePath();
	ctx.stroke();
 
}

function inflatePolygon(poly, spacing)
{
  var geoInput = vectorCoordinates2JTS(poly);
  geoInput.push(geoInput[0]);

  var geometryFactory = new jsts.geom.GeometryFactory();

  var shell = geometryFactory.createPolygon(geoInput);
  var polygon = shell.buffer(spacing, jsts.operation.buffer.BufferParameters.CAP_FLAT);

  var inflatedCoordinates = [];
  var oCoordinates;
  oCoordinates = polygon.shell.points.coordinates;
  for (i = 0; i < oCoordinates.length; i++) {
    var oItem;
    oItem = oCoordinates[i];
    inflatedCoordinates.push(new Vector2((oItem.x), (oItem.y)));
    console.log("iX,Y = " + inflatedCoordinates[i].x + " and iY = " + inflatedCoordinates[i].y);
  }
  return inflatedCoordinates;
}

function vectorCoordinates2JTS (polygon) {
  var coordinates = [];

  for (var i = 0; i < polygon.length; i++) {
    coordinates.push(new jsts.geom.Coordinate(polygon[i].x, polygon[i].y));
    console.log("X = " + coordinates[i].x + " and Y = " + coordinates[i].y);
  }
  return coordinates;
}


