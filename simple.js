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
    c    = new RoboroCanvas('canvas');
    k    = new RoboroKeyboard();
    trig = new RoboroMath(totalWidth/2, totalHeight/2, totalHeight/6, c);
    //    boatWorld = new RoboroOOWorld(c);

    window.mouse    = c.mouse;
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
    
    var numberOfFunctions = functions.length;
    
    for (var i = 0; i < numberOfFunctions; i++)
      window[functions[i]] = new Function('return c.'+ functions[i] +'.apply(c, arguments);');
    
    window.touchScreen = c.touchScreen;
    
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

function RoboroMath(origoX, origoY, step, canvas)
{
  this.origoX = origoX;
  this.origoY = origoY;
  this.step   = step;
  this.c      = canvas;

  var env = this;

  this.point = function(x, y, color, label, size)
  {
    var label = typeof(label) != 'undefined' ? label : "";
    var size = typeof(size) != 'undefined' ? size : 20;
    env.c.save();
    env.c.translate(this.origoX, this.origoY);
    env.c.circle(x*this.step, -y*this.step, size, color);
    
    var xOffset = x > 0 ? -4 : label.length*12+12;
    var yOffset = y > 0 ? 0 : 24;
    
    env.c.text(x*this.step+3-xOffset, -y*this.step-3+yOffset, size, label, color);
    
    restore();
  }

  this.polarPoint = function(v, r, color, label, size)
  {
    var label = typeof(label) != 'undefined' ? label : "";
    var size = typeof(size) != 'undefined' ? size : 20;
    var x = r*cos(v); 
    var y = r*sin(v); 
    point(x, y, color, label, size);
  }

  this.polarLine = function(v1, r1, v2, r2, color)
  {
    var x1 = r1*cos(v1); 
    var y1 = r1*sin(v1); 
    var x2 = r2*cos(v2); 
    var y2 = r2*sin(v2); 
    
    cartesianLine(x1, y1, x2, y2, color);
  }

  this.cartesianLabel = function(x, y, size, label, color)
  {
    env.c.save();
    env.c.translate(origoX, origoY);
    env.c.text(x*this.step, -y*this.step, size, label, color);
    restore();
  }
 
  this.cartesianLine = function(x1, y1, x2, y2, color)
  {
    env.c.save();
    env.c.translate(origoX, origoY);
    env.c.line(x1*this.step, -y1*this.step, x2*this.step, -y2*this.step, 2, color);
    restore();    
  }

  this.line3D = function(point1, point2, color)
  {
    point1.lineTo(point2, color);
  }
  
  this.Point3D = function(x, y, z, color)
  {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;

    this.draw = function()
    {
      env.c.save();
      env.c.translate(origoX, origoY);
      var zmax = 10;
      var zdiff = (zmax+this.z)/zmax;      
      var size = this.z+4 > 0 ? this.z+4+2 : 2;
      
      env.c.circle(this.x*env.step*zdiff, -this.y*env.step*zdiff, size, this.color);
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
      env.c.save();
      env.c.translate(origoX, origoY);
      var zmax = 10;
      var zdiff1 = (zmax+this.z)/zmax;
      var zdiff2 = (zmax+point2.z)/zmax;
      env.c.line(this.x*env.step*zdiff1, -this.y*env.step*zdiff1, point2.x*env.step*zdiff2, -point2.y*env.step*zdiff2, 1, color);
      restore();    
    }
  }
  
  this.axes = function()
  {
    env.c.line(origoX, 0, origoX, totalHeight, 2, "black");
    env.c.line(0, origoY, totalWidth, origoY, 2, "black");

    var yLines = Math.floor(totalHeight/this.step);
    var xLines = Math.floor(totalWidth/this.step);

    for(var i=-Math.floor(xLines/2);i<=Math.floor(xLines/2);i++)
      env.c.line(origoX+(i*this.step), origoY-10, origoX+(i*this.step), origoY+10, 1, "black");
    for(var i=-Math.floor(yLines/2);i<=Math.floor(yLines/2);i++)
      env.c.line(origoX-10, origoY+(i*this.step), origoX+10, origoY+(i*this.step), 1, "black");
    
    triangle(origoX-10, 10, origoX+10, 10, origoX, 0, "black");
    env.c.text(origoX-20, 30, 20, "y", "black");
    triangle(totalWidth-10, origoY-10, totalWidth-10, origoY+10, totalWidth, origoY, "black");
    env.c.text(totalWidth-30, origoY+22, 20, "x", "black");
  }
  
  this.unitCircle = function()
  {
    env.c.ring(origoX, origoY, 100, 1, "#333333");
  }

  this.arcDegrees = function(r, angle, width, color)
  {
    env.c.arc(origoX, origoY, r*this.step, angle, width, color);
  }

  this.angleDegrees = function(angle)
  {
    var radius = 30;
    arcDegrees(radius, angle, 2, "#553333");
  }

  this.angleRadians = function(angle)
  {
    var radius = 30;
    arcDegrees(radius, angle*(180/Math.PI), 2, "#553333");
  }
}

function RoboroOOWorld(canvas)
{
  this.canvas   = canvas;
  this.theBoats = [];

  var env = this;

  this.addBoat = function(boat)
  {
    this.theBoats[this.theBoats.length] = boat;
  }

  this.worldUpdate = function()
  {
    this.drawWorld();
    
    for (i=0; i<this.theBoats.length; i++) 
    {
      if(this.theBoats[i].updatePosition)
        this.theBoats[i].updatePosition();
      if(this.theBoats[i].draw)
        this.theBoats[i].draw();
    }
    
    this.drawWorldAfter();
  }
  
  setInterval(this.worldUpdate, 50);
  
  var blues = [
      "#99BBFF", "#6699FF", "#3366FF", "#0033CC"
  ];
  
  var waveOffs   = [0, 30, 60, 90];
  var waveHeight = 100;
  var stars      = null;
  
  initStars = function() 
  {
    env.stars = [];
    for (var i=0; i<50; i++) 
    {
      env.stars.push({
        x: Math.random()*totalWidth,
        y: Math.random()*120,
        size: Math.random()*3
      });
    }
  }
  
  this.drawWorld = function() 
  {
    if (!env.stars)
      this.initStars();
    
    function wave(x) 
    {
      return Math.abs(Math.sin(x)*(x%Math.PI/6));
    }
    
    function drawWaveblock(y, color, waveOff) 
    {
      env.canvas.context2D.fillStyle = color;
      env.canvas.context2D.beginPath();
      
      env.canvas.context2D.moveTo(0, y);
      for (var i=0; i<totalWidth; i++) 
      {
        env.canvas.context2D.lineTo(i, y+wave((i+waveOff)/30)*50);
      }
      env.canvas.context2D.lineTo(totalWidth, totalHeight);
      env.canvas.context2D.lineTo(0, totalHeight);
      env.canvas.context2D.closePath();
      
      env.canvas.context2D.fill();
    }
    
    env.canvas.context2D.fillStyle = "#111";
    env.canvas.context2D.fillRect(0, 0, totalWidth, totalHeight);
    
    for (var i=0; i<env.stars.length; i++) 
    {
      var star = env.stars[i];
      circle(star.x, star.y, star.size/2, "#FFF");
    }
        
    for (var i=0; i<env.blues.length; i++) 
    {
      drawWaveblock(env.waveHeight + i*60, env.blues[i], env.waveOffs[i]);
      waveOffs[i] += i+2;
    }
  }
  
  function drawWorldAfter() 
  {
    var plankWidth = 40;
    
      /* Planks */
    env.canvas.context2D.beginPath();
    for (var i=0; i<5; i++) 
    {
      env.canvas.context2D.moveTo((i+1)*plankWidth, 100);
      env.canvas.context2D.lineTo(i*plankWidth-1, totalHeight - 100);
      env.canvas.context2D.lineTo((i-1)*plankWidth, totalHeight - 100);
      env.canvas.context2D.lineTo(i*plankWidth+1, 100);
    }
    env.canvas.context2D.closePath();
    env.canvas.context2D.fillStyle = "#940";
    env.canvas.context2D.fill();
    
      /* Island */
    env.canvas.context2D.beginPath();
    env.canvas.context2D.moveTo(totalWidth, 70);
    env.canvas.context2D.quadraticCurveTo(totalWidth-70, totalHeight/2, totalWidth, totalHeight-50);
    env.canvas.context2D.closePath();
    env.canvas.context2D.fillStyle = "#C93";
    env.canvas.context2D.fill();
  }
}
