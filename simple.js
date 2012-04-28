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
  var head = document.getElementsByTagName('head')[0];
  var iOSMeta = document.createElement('meta');
  iOSMeta.name = "apple-mobile-web-app-capable";
  iOSMeta.content = "yes";
  head.appendChild(iOSMeta);
  
  maximizeCanvas();

  var env = this;

  var simplify = function() {

    c = new RoboroCanvas('canvas');
    k = new RoboroKeyboard();
    
    env.mouse = c.mouse;
    env.keyboard = k;

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
                 "line",
                 "stopUpdate"];

    for (i = 0; i < functions.length; i++)
      eval("env." + functions[i] + " = function() { c." + functions[i] + ".apply(c, arguments) }");

    if (typeof(start) != "undefined") 
      start();
    if (typeof(update) != "undefined") 
      c.update = function()
      {
        c.FPS = env.FPS;
        update();
      }
  };

  loadScript("http://www.spelprogrammering.nu/advanced.js", simplify);
}