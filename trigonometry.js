function drawPoint(x, y, color, label, size)
{
  var label = typeof(label) != 'undefined' ? label : "";
  var size = typeof(size) != 'undefined' ? size : 5;
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  var step = totalHeight/6;
  save();
  translate(origoX, origoY);
  circle(x*step, -y*step, size, color);

  var xOffset = x > 0 ? -4 : label.length*12;
  var yOffset = y > 0 ? 0 : 20;

  text(label,x*step+3-xOffset, -y*step-3+yOffset, color, 20);

  restore();
}

function drawCartesianPoint(x, y, color, label)
{
  drawPoint(x, y, color, label);
}

function drawPolarPoint(v, r, color, label, size)
{
  var label = typeof(label) != 'undefined' ? label : "";
  var size = typeof(size) != 'undefined' ? size : 2;
  var x = r*cos(v); 
  var y = r*sin(v); 
  drawPoint(x, y, color, label, size);
}

function drawPolarLine(v1, r1, v2, r2, color)
{
  var x1 = r1*cos(v1); 
  var y1 = r1*sin(v1); 
  var x2 = r2*cos(v2); 
  var y2 = r2*sin(v2); 

  drawCartesianLine(x1, y1, x2, y2, color);
}

function drawLabel(x, y, l, color, size)
{
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  var step = totalHeight/6;
  var size = typeof(size) != 'undefined' ? size : 20;
  save();
  translate(origoX, origoY);
  text(label, x*step, -y*step, color, size);
  restore();    
}
 
function drawLine(x1, y1, x2, y2, color)
{
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  var step = totalHeight/6;
  save();
  translate(origoX, origoY);
  line(x1*step, -y1*step, x2*step, -y2*step, 2, color);
  restore();    
}

function drawCartesianLine(x1, y1, x2, y2, color)
{
  drawLine(x1, y1, x2, y2, color);
}


function point3D(x, y, z, color)
{
  this.x = x;
  this.y = y;
  this.z = z;
  this.color = color;

  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  var step = 100;

  this.draw = function()
  {
    save();
    translate(origoX, origoY);
    var zmax = 10;

    var zdiff = (zmax+this.z)/zmax;

    var size = 5+this.z*2 > 0 ? 5+this.z*2 : 0.1;

    circle(this.x*step*zdiff, -this.y*step*zdiff, size, this.color);
    restore();
  }

  this.rotate = function(dvx, dvy, dvz)
  {
    // rotate about x
    var oldY = this.y;
    var oldZ = this.z;
    this.y = oldY*cos(dvx)-oldZ*sin(dvx);
    this.z = oldY*sin(dvx)+oldZ*cos(dvx);

    // rotate about y
    var oldX = this.x;
    oldZ = this.z;
    this.x = oldZ*sin(dvy)+oldX*cos(dvy);
    this.z = oldZ*cos(dvy)-oldX*sin(dvy);

    // rotate about z
    oldX = this.x;
    oldY = this.y;
    this.x = oldX*cos(dvz)-oldY*sin(dvz);
    this.y = oldX*sin(dvz)+oldY*cos(dvz);    
  }

  this.lineTo = function(point2, color)
  {
    save();
    translate(origoX, origoY);
    line(this.x*step, -this.y*step, point2.x*step, -point2.y*step, 1, color);
    restore();    
  }

  this.drawLabel = function(label)
  {
    save();
    translate(origoX, origoY);
    text(label,this.x*step+3, -this.y*step-3, "white", 10);
    restore();
  }
}


function drawAxes()
{
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  var step = totalHeight/6;

  line(origoX, 0, origoX, totalHeight, 2, "black");
  line(0, origoY, totalWidth, origoY, 2, "black");
  for(i=-4;i<=4;i++)
    line(origoX+(i*step), origoY-10, origoX+(i*step), origoY+10, 1, "black");
  for(i=-2;i<=2;i++)
    line(origoX-10, origoY+(i*step), origoX+10, origoY+(i*step), 1, "black");

  triangle(origoX-10, 10, origoX+10, 10, origoX, 0, "black");
  text("y",origoX-20, 30, "black", 20);
  triangle(totalWidth-10, origoY-10, totalWidth-10, origoY+10, totalWidth, origoY, "black");
  text("x",totalWidth-30, origoY+22, "black", 20);
}

function drawUnitCircle()
{
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  emptyCircle(origoX, origoY, 100, 1, "#333333");
}

function drawCircle(r, width, color)
{
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  var step = totalHeight/6;
  emptyCircle(origoX, origoY, r*step, width, color);
}

function drawArc(r, angle, width, color)
{
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  var step = totalHeight/6;
  emptyArc(origoX, origoY, r*step, angle, width, color);
}

function drawAngleDegrees(angle, radius)
{
  var radius = typeof(radius) != 'undefined' ? radius : 30;
  drawAngle(angle*(Math.PI/180), radius);
}

function drawAngleRadians(angle, radius)
{
  var radius = typeof(radius) != 'undefined' ? radius : 30;
  drawAngle(angle, radius);
}

function drawAngle(angle, radius)
{
  var radius = typeof(radius) != 'undefined' ? radius : 30;
  var origoX = totalWidth/2;
  var origoY = totalHeight/2;
  emptyArc(origoX, origoY, radius, angle, 2, "#553333");
}
