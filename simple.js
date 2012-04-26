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

function maximizeCanvas()
{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
  totalWidth = canvas.width;
  totalHeight = canvas.height;
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
  
  maximizeCanvas();

  var env = this;

  var simplify = function() {

    c = new RoboroCanvas('canvas');
    
    env.FPS = 30;
    
    env.mouse = c.mouse;

    functions = ["circle", 
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
                 "line"];

    for (i = 0; i < functions.length; i++)
      eval("env." + functions[i] + " = function() { c." + functions[i] + ".apply(c, arguments) }");

    if (typeof(start) != "undefined") 
      start();
    if (typeof(update) != "undefined") 
    {
      updateTimer = setInterval(update, 1000/env.FPS);
    }

    env.stopUpdate = function()
    {
      clearInterval(updateTimer);
    }

  };

  loadScript("http://www.spelprogrammering.nu/advanced.js", simplify);
}