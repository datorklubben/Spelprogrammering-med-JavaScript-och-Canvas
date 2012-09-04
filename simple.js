window.onload = init;


Function.prototype.bind || (Function.prototype.bind = function(thisObj/*, ...boundArgs*/)
{
  var fn        = this
  var boundArgs = Array.prototype.slice.call(arguments, 1)

  return function(/*...args*/)
  {
    var args = Array.prototype.slice.call(arguments)
    return fn.apply(thisObj, boundArgs.concat(args))
  }
})

// Loads the given URL as javascript, and runs the passed callback when
// the script has loaded.
function loadScript(url, callback)
{
  var head   = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  
  script.type               = 'text/javascript';
  script.src                = url;
  script.onreadystatechange = callback;
  script.onload             = callback;
  
  head.appendChild(script);
}

// Prepares the global `canvas` to occupy the whole page.
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
  // Prepare the global `canvas`.
  canvas = document.createElement('canvas');
  
  canvas.id             = 'canvas';
  canvas.style.position = 'absolute';
  canvas.style.left     = '0';
  canvas.style.top      = '0';
  
  document.body.setAttribute("oncontextmenu", "return false");
  document.body.appendChild(canvas);
  
  // Hide the address bar on iPhone/iPad
  var head    = document.getElementsByTagName('head')[0];
  var iOSMeta = document.createElement('meta');

  iOSMeta.name    = "apple-mobile-web-app-capable";
  iOSMeta.content = "yes";
  head.appendChild(iOSMeta);
  
  FPS            = 30;
  suppressErrors = false;
  
  // Prepare the canvas
  prepareCanvas();

  var simplify = function()
  {
    c    = new RoboroCanvas('canvas');
    k    = new RoboroKeyboard();
    trig = new RoboroMath(totalWidth/2, totalHeight/2, totalHeight/6, c);
    //    boatWorld = new RoboroOOWorld(c);
    
    window.mouse    = c.mouse;
    window.keyboard = k;

    // Import some common things from `Math` to the global namespace.
    importMethods(window, Math, ["sin", "cos", "tan", "asin", "acos", "atan",
                                 "sqrt", "floor", "PI", "abs"], true)
    
    // Also import a bunch of canvas-related functions from the special canvas
    // that occupies the whole page into the global namespace.
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
       "color",
       "save",
       "restore",
       "translate",
       "scale",
       "rotate",
       "rotateRadians",
       "line",
       "stopUpdate"];
    
    importMethods(window, c, functions)
    
    window.touchScreen = c.touchScreen;

    loadAndEvalScript()
    
    // See if the special entry-points `start` and `update` are defined, and if
    // so, make sure to either execute `start` or setup a timer that keeps
    // running `update`.
    if (typeof(start) != "undefined")
      start();
    if (typeof(update) != "undefined")
      c.update = function()
      {
        c.FPS = window.FPS;
        update();
      }

    // Imports the given methods from object `source` to object `target`, being
    // attached to `target` and with their 'this' bound to `source`.
    //    If `lowercaseNames` is true, then the names of the methods being added
    // to `target` are transformed to lowercase.  If `source[name]` for a given
    // name isn't a function, then it is just copied over.
    function importMethods(target, source, methods, lowercaseNames)
    {
      methods.forEach(function(name)
      {
        var newName = (lowercaseNames ? name.toLowerCase() : name);

        if (typeof source[name] == 'function')
          target[newName] = source[name].bind(source);
        else
          target[newName] = source[name];
      });

      return target;
    }

    // Find the script tag that included simple.js, and eval its body.
    function loadAndEvalScript()
    {
      var elems = document.getElementsByTagName('script')

      for (var i=0; i<elems.length; i++)
      {
        var el         = elems[i];
        var globalEval = wrapWithTryCatch(eval);

        if (el.src.match(/simple\.js$/))
          globalEval(el.innerHTML);
      }

      // Patch global `start` or `update` with a try-catch that prints stuff to
      // our custom error console.
      if (window.start)
        window.start = wrapWithTryCatch(window.start);

      if (window.update)
        window.update = wrapWithTryCatch(window.update);

      function wrapWithTryCatch(fn)
      {
        return function(/*...args*/)
        {
          try
          {
            fn.apply(this, arguments);
          }
          catch (err)
          {
            console.log("Caught error! Do we have appendErrorToConsole?",
                        Boolean(window.appendErrorToConsole));
            // Append error, if errorconsole has loaded.
            if (window.appendErrorToConsole)
              appendErrorToConsole(err);

            throw err; // re-throw the error so the browser's console can also
                       // catch it.
          }
        };
      }
    }

//     function loadAndEvalScript()
//     {
//       var elems = document.getElementsByTagName('script')

//       for (var i=0; i<elems.length; i++)
//       {
//         var el         = elems[i];
//         var globalEval = (1, eval);

//         if (el.src.match(/simple\.js$/))
//           globalEval(el.innerHTML);
//       }
//     }
  };
  
  loadScript("http://www.spelprogrammering.nu/errorconsole.js", function() {
      loadScript("http://www.spelprogrammering.nu/advanced.js", simplify);
    });
  //  loadScript("http://www.spelprogrammering.nu/advanced.js", simplify);
}

// Try not to read anything below this line...
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
