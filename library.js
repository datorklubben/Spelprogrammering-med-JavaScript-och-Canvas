window.onload = init;

function start(){}
function update(){}

// deprecated, will be removed!
red       = "rgb(255, 0, 0)";
green     = "rgb(0, 255, 0)";
blue      = "rgb(0, 0, 255)";
yellow    = "rgb(255, 255, 0)";
pink      = "rgb(255, 192, 203)";
violet    = "rgb(238, 130, 238)";
indigo    = "rgb(75, 0, 130)";
turquoise = "rgb(0, 245, 255)";
cyan      = "rgb(0, 255, 255)";
orange    = "rgb(255, 165, 0)";
white     = "rgb(255, 255, 255)";
black     = "rgb(0, 0, 0)";

up    = 38;
down  = 40;
left  = 37;
right = 39;
space = 32;
zero  = 48;
one   = 49;
two   = 50;
three = 51;
four  = 52;
five  = 53;
six   = 54;
seven = 55;
eight = 56;
nine  = 57;
w     = 87;
a     = 65;
s     = 83;
d     = 68;

function init()
{
  canvas = document.getElementById('canvas');
  context2D = canvas.getContext('2d');

  totalWidth = canvas.width;
  totalHeight = canvas.height;

  pi = Math.PI;

  keyboard = new Array();
  mouse    = new Array();
  
  currentKey = "";
  mouseX = -10000;
  mouseY = -10000;
  
  mouseLeftDown   = false;
  mouseMiddleDown = false;
  mouseRightDown  = false;
  
  document.onkeydown  = keyPressed;
  document.onkeyup    = keyReleased;
  canvas.onmousedown  = mouseDown;
  canvas.onmouseup    = mouseUp;
  canvas.onmousemove  = mouseMovement;
  canvas.ontouchstart = touchDown;
  canvas.ontouchend   = touchUp;
  canvas.ontouchmove  = touchMove;

  FPS = 30;
  
  start();
  
  theAnimation = setInterval(update, 1000/FPS);
}

function stopUpdate()
{
  clearInterval(theAnimation);
}

function touchDown(e) 
{
  mouseLeftDown = true;
}

function touchUp(e) 
{
  mouseLeftDown = false;
}

function touchMove(e)
{
  if (e.touches.length == 1)
  {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  }
  return false;
}

function mouseDown(event)
{
  mouse[event.button] = 1;
  
  if (event.button == 0)
    mouseLeftDown = true;
  else if (event.button == 1)
    mouseMiddleDown = true;
  else if (event.button == 2)
    mouseRightDown = true;
}

function mouseUp(event)
{
  mouse[event.button] = 0;

  if (event.button == 0)
    mouseLeftDown = false;
  else if (event.button == 1)
    mouseMiddleDown = false;
  else if (event.button == 2)
    mouseRightDown = false;
}

function keyDown(key)
{
  return keyboard[key] == 1;
}

function keyPressed(event)
{
  keyboard[event.keyCode] = 1;
}

function keyReleased(event)
{
  keyboard[event.keyCode] = 0;
}

function mouseMovement(event)
{
  if (event.pageX || event.pageY)
  {
    pageX = event.pageX;
    pageY = event.pageY;
  }
  else if (event.clientX || event.clientY)
  {
    pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    pageY = event.clientY + document.body.scrollLeft + document.documentElement.scrollLeft;
  }

  mouseX = pageX - canvas.offsetLeft;
  mouseY = pageY - canvas.offsetTop;
}

function circle(x, y, r, color) 
{
  context2D.fillStyle = color;
  context2D.beginPath();
  context2D.arc(x, y, r, 0, Math.PI * 2, true);
  context2D.closePath();
  context2D.fill();
}

function rectangle(x, y, width, height, color) 
{
  context2D.fillStyle = color;
  context2D.fillRect(x, y, width, height);
}

function triangle(x1, y1, x2, y2, x3, y3, color) 
{
  context2D.fillStyle = color;
  context2D.beginPath();
  context2D.moveTo(x1, y1);
  context2D.lineTo(x2, y2);
  context2D.lineTo(x3, y3);
  context2D.fill();
}

function text(text, x, y, color, size)
{
  context2D.font = size + "pt Helvetica";
  context2D.fillStyle = color;
  context2D.fillText(text, x, y);
}

function random(max)
{
  return Math.floor(Math.random() * max);
}

function randomAlternative(lista)
{
  return lista[random(lista.length)];
}

function picture(x, y, file)
{
  img = new Image();
  img.src = file;
  context2D.drawImage(img, x, y);
}

function clearScreen()
{
  context2D.clearRect(0, 0, totalWidth, totalHeight);
}

function clearScreenWithColor(color)
{
  clearScreen();
  rectangle(0, 0, totalWidth, totalHeight, color);
}

function distance(x1, y1, x2, y2)
{
  xdiff = Math.abs(x1 - x2);
  ydiff = Math.abs(y1 - y2);

  return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
}

function save()
{
  context2D.save();
}

function restore()
{
  context2D.restore();
}

function translate(x, y)
{
  context2D.translate(x, y);
}

function rotate(degrees)
{
  context2D.rotate(degrees * Math.PI / 180);
}

function rotateRadians(radians)
{
  context2D.rotate(radians);
}

function rgb(r, g, b)
{
  return "rgb(" + r + "," + g + "," + b + ")";
}

function line(x1, y1, x2, y2, width, color)
{
  context2D.strokeStyle = color;
  context2D.lineWidth   = width;
  context2D.beginPath();
  context2D.moveTo(x1, y1);
  context2D.lineTo(x2, y2);
  context2D.stroke();
  context2D.closePath();
}

function sin(angle)
{
  return Math.sin(angle);
}

function asin(angle)
{
  return Math.asin(angle);
}

function cos(angle)
{
  return Math.cos(angle);
}

function acos(angle)
{
  return Math.acos(angle);
}

function tan(angle)
{
  return Math.tan(angle);
}

function atan(angle)
{
  return Math.atan(angle);
}

function sqrt(x)
{
  return Math.sqrt(x);
}

function abs(x)
{
  return Math.abs(x);
}

function pow(x, y)
{
  return Math.pow(x, y);
}

function floor(x)
{
  return Math.floor(x);
}

function emptyCircle(x, y, r, lineWidth, color)
{
  context2D.beginPath();
  context2D.arc(x, y, r, 0, Math.PI * 2, true);
  context2D.closePath();
  context2D.lineWidth = lineWidth;
  context2D.strokeStyle = color;
  context2D.stroke();
}

function ring(x, y, r, lineWidth, color)
{
  emptyCircle(x, y, r, lineWidth, color);
}

function emptyArc(x, y, r, angle, lineWidth, color)
{
  context2D.beginPath();
  context2D.arc(x, y, r, 0, -angle, true);
  context2D.lineWidth = lineWidth;
  context2D.strokeStyle = color;
  context2D.stroke();
}

function maximizeCanvas()
{
  canvas.width = window.innerWidth-1;
  canvas.height = window.innerHeight-1;
  totalWidth = canvas.width;
  totalHeight = canvas.height;
}

function padString(subject, character, length, side)
{
  subject = "" + subject;
  while (subject.length < length)
    subject = side == "left" ? character + subject : subject + character;
  return subject;
}

function logger(message)
{
  var log = document.getElementById('log');
  
  var date = new Date();
  
  var time = [ padString(date.getHours(), '0', 2, 'left'),
               padString(date.getMinutes(), '0', 2, 'left'),
               padString(date.getSeconds(), '0', 2, 'left') ].join(':');
  
  if (!log)
  {
    log = document.createElement('table');
    log.id = 'log';
    log.style.border = '5px outset white';
    log.style.background = 'black';
    log.style.color = 'white';
    log.style.margin = '1em';
    document.body.appendChild(log);
  }
  
  var row = log.insertRow(-1);
  row.innerHTML =
    '<td style="vertical-align: top"><pre>'+ time +
    '  </pre></td><td><pre>'+
    message.replace(/</, '&lt;') +'</pre></td>';
}

window.onerror = function(message, url, line)
{
  logger('ERROR: '+ message +' (line '+ line +')');
};

function getSoundChannel()
{
  var soundEffects = document.getElementById('soundEffects');
  
  if (!soundEffects)
  {
    soundEffects = document.createElement('div');
    soundEffects.id = 'soundEffects';
    
    for (var i = 0; i < 8; i++)
      soundEffects.appendChild(document.createElement('audio'));
    
    document.body.appendChild(soundEffects);
  }
  
  var channels = soundEffects.children;
  
  if (typeof(currentChannel) == 'undefined' || ++currentChannel >= channels.length)
    currentChannel = 0;
  
  return channels[currentChannel];
}

function preloadSound(sound)
{
  if (! sound.match(/\/|\.[a-z]+$/i))
    sound = 'http://spelprogrammering.nu/sounds/' + sound + '.mp3';
  
  var channel = getSoundChannel();
  channel.preload = 'auto';
  channel.src = sound;
}

function playSound(sound, volume)
{
  if (! sound.match(/\/|\.[a-z]+$/i))
    sound = 'http://spelprogrammering.nu/sounds/' + sound + '.mp3';
  
  if (typeof(volume) == 'undefined')
    var volume = 1;
  
  var channel = getSoundChannel();
  channel.volume = volume;
  channel.src = sound;
  channel.play();
}

function playBackgroundSound(sound, volume)
{
  var channel = document.getElementById('backgroundSound');
  
  if (!channel)
  {
    channel = document.createElement('audio');
    channel.id = 'backgroundSound';
    channel.loop = true;
    document.body.appendChild(channel);
  }
  
  if (typeof(volume) == 'undefined')
    var volume = 1;
  
  channel.volume = volume;
  channel.src = sound;
  channel.play();
}
