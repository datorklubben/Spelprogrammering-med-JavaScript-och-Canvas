function RoboroKeyboard()
{
  var env = this;
  
  this.names =
  {
    38: "up"
  };
  
  for (var code in this.names)
    this[this.names[code]] = false;
  
  document.onkeydown = function(event)
  {
    if (env.names[event.keyCode] !== undefined)
      env[env.names[event.keyCode]] = true;
  };
  
  document.onkeyup = function(event)
  {
    if (env.names[event.keyCode] !== undefined)
      env[env.names[event.keyCode]] = false;
  };
}

function RoboroCanvas(id)
{
  var env = this;
  
  this.id = id;
  
  var canvas = document.getElementById(id);
  
  this.context2D = canvas.getContext('2d');
  
  this.width = canvas.width;
  this.height = canvas.height;
  
  this.mouse = 
  {
    x: -10000,
    y: -10000,
    left: false,
    right: false,
    middle: false
  };
  
  this.touchScreen =
  {
    points: [],
    currentlyTouched: false
  };
  
  window.addEventListener('mousedown', function(event)
  {
    if (event.button == 0)
      env.mouse.left = true;
    else if (event.button == 1)
      env.mouse.middle = true;
    else if (event.button == 2)
      env.mouse.right = true;
  }, true);
  
  window.addEventListener('mouseup', function(event)
  {
    if (event.button == 0)
      env.mouse.left = false;
    else if (event.button == 1)
      env.mouse.middle = false;
    else if (event.button == 2)
      env.mouse.right = false;
  }, true);
  
  canvas.onmousemove = function(event)
  {
    env.mouse.x = event.pageX - canvas.offsetLeft;
    env.mouse.y = event.pageY - canvas.offsetTop;
  };

  canvas.onmouseout = function(event)
  {
    env.mouse.x = env.mouse.y = - 10000;
  };
  
  document.addEventListener('touchstart', function(event)
  {
    env.mouse.left = true;
  });
  
  document.addEventListener('touchend', function(event)
  {
    if (event.touches.length == 0)
    {
      env.mouse.left = false;
      env.touchScreen.currentlyTouched = false;
    }
  });
  
  canvas.ontouchstart = function(event)
  {
    env.touchScreen.points = event.touches;
  };
  
  canvas.ontouchend = function(event)
  {
    for (var u = 0; u < event.touches.length; u++)
    {
      for (var i = 0; i < event.changedTouches.length; i++)
      {
        if (event.changedTouches[i].identifier == event.touches[u].identifier)
        {
          event.touches[u].clientX = -100000;
          event.touches[u].clientY = -100000;
        }
      }
    }
    
    env.touchScreen.points = event.touches;
  }
  
  canvas.ontouchmove = function(e)
  {
    event.preventDefault();
    
    env.mouse.x = event.touches[0].clientX - canvas.offsetLeft;
    env.mouse.y = event.touches[0].clientY - canvas.offsetTop;
    env.touchScreen.points = event.touches;
  };
  
  this.FPS = 30;
  this.running = true;
  
  this.canvas = canvas;
  
  this.update = function() {};
  
  this.runUpdate = function()
  {
    if (env.running)
    {
      env.update();
      env.updateTimer = setTimeout(env.runUpdate, 1000/env.FPS);
    }
  };
  
  this.updateTimer = setTimeout(this.runUpdate, 1000/this.FPS);
  
  this.stopUpdate = function()
  {
    env.running = false;
  };
  
  this.circle = function(x, y, radius, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context2D.closePath();
    this.context2D.fill();
  };

  this.rectangle = function(x, y, width, height, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.fillRect(x, y, width, height);
  };
  
  this.triangle = function(x1, y1, x2, y2, x3, y3, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.lineTo(x2, y2);
    this.context2D.lineTo(x3, y3);
    this.context2D.fill();
  };
  
  this.ring = function(x, y, radius, lineWidth, color)
  {
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context2D.closePath();
    this.context2D.lineWidth = lineWidth;
    this.context2D.strokeStyle = color;
    this.context2D.stroke();
  };
  
  this.arc = function(x, y, radius, angle, lineWidth, color)
  {
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, -angle * Math.PI / 180, true);
    this.context2D.lineWidth = lineWidth;
    this.context2D.strokeStyle = color;
    this.context2D.stroke();
  };
  
  this.text = function(x, y, size, text, color)
  {
    this.context2D.font = size + "pt monospace";
    this.context2D.fillStyle = color;
    this.context2D.fillText(text, x, y);
  };
  
  this.random = function(max)
  {
    return Math.floor(Math.random() * max);
  };
  
  this.randomAlternative = function(list)
  {
    return list[random(list.length)];
  };
  
  this.picture = function(x, y, file)
  {
    var img = new Image();
    img.src = file;
    this.context2D.drawImage(img, x, y);
  };
  
  this.clearScreen = function()
  {
    this.context2D.clearRect(0, 0, this.width, this.height);
  };

  this.fill = function(color)
  {
    this.rectangle(0, 0, this.width, this.height, color);
  };

  this.distance = function(x1, y1, x2, y2)
  {
    var dx = x1 - x2;
    var dy = y1 - y2;
  
    return Math.sqrt(dx * dx + dy * dy);
  };

  this.save = function()
  {
    this.context2D.save();
  };

  this.restore = function()
  {
    this.context2D.restore();
  };

  this.translate = function(x, y)
  {
    this.context2D.translate(x, y);
  };
  
  this.rotate = function(degrees)
  {
    this.context2D.rotate(degrees * Math.PI / 180);
  };

  this.rotateRadians = function(radians)
  {
    this.context2D.rotate(radians);
  };

  this.line = function(x1, y1, x2, y2, width, color)
  {
    this.context2D.strokeStyle = color;
    this.context2D.lineWidth = width;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.lineTo(x2, y2);
    this.context2D.stroke();
    this.context2D.closePath();
  };
}
