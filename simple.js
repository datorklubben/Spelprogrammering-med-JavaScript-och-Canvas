window.onload = init;

function loadScript(url, callback)
{
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onreadystatechange = callback;
  script.onload = callback;
  head.appendChild(script);
}

function prepareCanvas()
{
  canvas.width        = window.innerWidth;
  canvas.height       = window.innerHeight;
  canvas.style.width  = window.innerWidth;
  canvas.style.height = window.innerHeight;
  totalWidth          = canvas.width;
  totalHeight         = canvas.height;
  origoX              = totalWidth/2;
  origoY              = totalHeight/2;
  step                = totalHeight/6;
}

function init()
{
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  document.body.setAttribute("oncontextmenu", "return false");
  document.body.appendChild(canvas);
  var head = document.getElementsByTagName('head')[0];
  var iOSMeta = document.createElement('meta');
  iOSMeta.name = "apple-mobile-web-app-capable";
  iOSMeta.content = "yes";
  head.appendChild(iOSMeta);

  FPS = 30;
  
  prepareCanvas();

  var simplify = function()
  {
    c = new RoboroCanvas('canvas');
    k = new RoboroKeyboard();
    
    window.mouse = c.mouse;
    window.keyboard = k;
    
    mathSimplifications = ["sin",
                           "cos",
                           "tan",
                           "asin",
                           "acos",
                           "atan",
                           "sqrt",
                           "PI"];
    
    for (i = 0; i < mathSimplifications.length; i++)
      window[mathSimplifications[i].toLowerCase()] = Math[mathSimplifications[i]];
    
    var functions =
      ["circle", 
       "rectangle", 
       "triangle", 
       "ring", 
       "arc",
       "text",
       "random",
       "randomAlternative",
       "picture",
       "clearScreen",
       "fill",
       "distance",
       "save",
       "restore",
       "translate",
       "rotate",
       "rotateRadians",
       "line",
       "stopUpdate"];
    
    for (var i = functions.length; i >= 0; i--)
      window[functions[i]] = new Function('c.'+ functions[i] +'.apply(c, arguments);');
    
    if (typeof(start) != "undefined") 
      start();
    if (typeof(update) != "undefined") 
      c.update = function()
      {
        c.FPS = window.FPS;
        update();
      }
  };
  
  loadScript("http://www.spelprogrammering.nu/advanced.js", simplify);
}

function drawPoint(x, y, color, label, size)
{
  var label = typeof(label) != 'undefined' ? label : "";
  var size = typeof(size) != 'undefined' ? size : 20;
  save();
  translate(origoX, origoY);
  circle(x*step, -y*step, size, color);
  
  var xOffset = x > 0 ? -4 : label.length*12+12;
  var yOffset = y > 0 ? 0 : 24;
  
  text(x*step+3-xOffset, -y*step-3+yOffset, size, label, color);

  restore();
}

function drawPolarPoint(v, r, color, label, size)
{
  var label = typeof(label) != 'undefined' ? label : "";
  var size = typeof(size) != 'undefined' ? size : 20;
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

function drawCartesianLabel(x, y, size, label, color)
{
  save();
  translate(origoX, origoY);
  text(x*step, -y*step, size, label, color);
  restore();
}
 
function drawCartesianLine(x1, y1, x2, y2, color)
{
  save();
  translate(origoX, origoY);
  line(x1*step, -y1*step, x2*step, -y2*step, 2, color);
  restore();    
}

function line3D(point1, point2, color)
{
  point1.lineTo(point2, color);
}

function point3D(x, y, z, color)
{
  this.x = x;
  this.y = y;
  this.z = z;
  this.color = color;

  this.draw = function()
  {
    save();
    translate(origoX, origoY);
    var zmax = 10;

    var zdiff = (zmax+this.z)/zmax;

    var size = this.z*2+2 > 1 ? this.z*2+2 : 1;

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
    var zmax = 10;
    var zdiff1 = (zmax+this.z)/zmax;
    var zdiff2 = (zmax+point2.z)/zmax;
    line(this.x*step*zdiff1, -this.y*step*zdiff1, point2.x*step*zdiff2, -point2.y*step*zdiff2, 1, color);
    restore();    
  }
}

function drawAxes()
{
  line(origoX, 0, origoX, totalHeight, 2, "black");
  line(0, origoY, totalWidth, origoY, 2, "black");
  for(i=-3;i<=3;i++)
    line(origoX+(i*step), origoY-10, origoX+(i*step), origoY+10, 1, "black");
  for(i=-2;i<=2;i++)
    line(origoX-10, origoY+(i*step), origoX+10, origoY+(i*step), 1, "black");

  triangle(origoX-10, 10, origoX+10, 10, origoX, 0, "black");
  text(origoX-20, 30, 20, "y", "black");
  triangle(totalWidth-10, origoY-10, totalWidth-10, origoY+10, totalWidth, origoY, "black");
  text(totalWidth-30, origoY+22, 20, "x", "black");
}

function drawUnitCircle()
{
  ring(origoX, origoY, 100, 1, "#333333");
}

function drawArc(r, angle, width, color)
{
  arc(origoX, origoY, r*step, angle, width, color);
}

function drawAngleDegrees(angle)
{
  var radius = 30;
  drawArc(radius, angle, 2, "#553333");
}

function drawAngleRadians(angle)
{
  var radius = 30;
  drawArc(radius, angle*(180/Math.PI), 2, "#553333");
}

theBoats = [];

function addBoat(boat)
{
  theBoats[theBoats.length] = boat;
}

function startOOWorld() 
{
  function worldUpdate()
  {
    drawWorld();
    
    for (i=0; i<theBoats.length; i++) 
    {
      if(theBoats[i].updatePosition)
        theBoats[i].updatePosition();
      if(theBoats[i].draw)
        theBoats[i].draw();
    }
    
    drawWorldAfter();
  }
  
  setInterval(worldUpdate, 50);
  
  var blues = [
      "#99BBFF", "#6699FF", "#3366FF", "#0033CC"
  ];
  
  var waveOffs = [0, 30, 60, 90];
  var waveHeight = 100;
  var stars = null;
  
  function initStars() 
  {
    stars = [];
    for (var i=0; i<50; i++) 
    {
      stars.push({
        x: Math.random()*totalWidth,
        y: Math.random()*120,
        size: Math.random()*3
      });
    }
  }
  
  function drawWorld() 
  {
    if (!stars)
      initStars();
    
    function wave(x) 
    {
      return Math.abs(Math.sin(x)*(x%Math.PI/6));
    }
    
    function drawWaveblock(y, color, waveOff) 
    {
      c.context2D.fillStyle = color;
      c.context2D.beginPath();
      
      c.context2D.moveTo(0, y);
      for (var i=0; i<totalWidth; i++) 
      {
        c.context2D.lineTo(i, y+wave((i+waveOff)/30)*50);
      }
      c.context2D.lineTo(totalWidth, totalHeight);
      c.context2D.lineTo(0, totalHeight);
      c.context2D.closePath();
      
      c.context2D.fill();
    }
    
    c.context2D.fillStyle = "#111";
    c.context2D.fillRect(0, 0, totalWidth, totalHeight);
    
    for (var i=0; i<stars.length; i++) 
    {
      var star = stars[i];
      circle(star.x, star.y, star.size/2, "#FFF");
    }
        
    for (var i=0; i<blues.length; i++) 
    {
      drawWaveblock(waveHeight + i*60, blues[i], waveOffs[i]);
      waveOffs[i] += i+2;
    }
  }
  
  function drawWorldAfter() 
  {
    var plankWidth = 40;
    
      /* Planks */
    c.context2D.beginPath();
    for (var i=0; i<5; i++) 
    {
      c.context2D.moveTo((i+1)*plankWidth, 100);
      c.context2D.lineTo(i*plankWidth-1, totalHeight - 100);
      c.context2D.lineTo((i-1)*plankWidth, totalHeight - 100);
      c.context2D.lineTo(i*plankWidth+1, 100);
    }
    c.context2D.closePath();
    c.context2D.fillStyle = "#940";
    c.context2D.fill();
    
      /* Island */
    c.context2D.beginPath();
    c.context2D.moveTo(totalWidth, 70);
    c.context2D.quadraticCurveTo(totalWidth-70, totalHeight/2, totalWidth, totalHeight-50);
    c.context2D.closePath();
    c.context2D.fillStyle = "#C93";
    c.context2D.fill();
  }
}
