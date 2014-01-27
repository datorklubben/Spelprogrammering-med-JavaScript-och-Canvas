// Copyright (c) 2012 Pontus Walck, Mikael Tylmad
// 
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


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
  
  updatesPerSecond = 30;
  suppressErrors   = false;
  
  // Prepare the canvas
  prepareCanvas();

  var simplify = function()
  {
    c    = new RoboroCanvas('canvas');
    k    = new RoboroKeyboard();
    math = new RoboroMath(totalWidth/2, totalHeight/2, totalHeight/6, c);
    trig = math;
    turtle = new RoboroTurtle(totalWidth/2, totalHeight/2, c);

    var roboroSound     = new RoboroSound();
    window.playSound    = function(url, volume) { roboroSound.playSound(url, volume) };
    window.loopSound    = function(url, volume) { roboroSound.loopSound(url, volume) };
    window.stopSound    = function(url) { roboroSound.stopSound(url) };
    window.preloadSound = function(url) { roboroSound.preloadSound(url) };
    
    window.mouse    = c.mouse;
    window.keyboard = k;

    // Import some common things from `Math` to the global namespace.
    importMethods(window, Math, ["sin", "cos", "tan", "asin", "acos", "atan", "round",
                                 "sqrt", "floor", "ceil", "PI", "abs", "pow"], true)
    
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
       "distance3D",
       "mixColor",
       "randomColor",
       "save",
       "restore",
       "translate",
       "scale",
       "rotate",
       "rotateRadians",
       "line",
       "arrow",
       "getPixel",
       "stopUpdate"];
    
    importMethods(window, c, functions)
    
    window.touchscreen = c.touchscreen;

    window.hideMouse = function() { canvas.style.cursor = 'none'; };
    window.showMouse = function() { canvas.style.cursor = 'default'; };
    
    loadAndEvalScript()
    
    // See if the special entry-points `start` and `update` are defined, and if
    // so, make sure to either execute `start` or setup a timer that keeps
    // running `update`.
    if (typeof(start) != "undefined")
      start();
    if (typeof(update) != "undefined")
      c.update = function()
      {
        c.updatesPerSecond = window.updatesPerSecond;
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
  };
  
  loadErrorConsole();
  loadScript("http://www.spelprogrammering.nu/advanced.js", simplify);
}

function loadErrorConsole() {
  var errorConsole;
  var global = this;

  global.appendErrorToConsole = function(err) {
    if (!errorConsole)
    {
      errorConsole = createErrorConsole();
    }

    var li = createErrorLi(err);
    errorConsole.ul.appendChild(li);

    // Creates a list element for the given Error `err`.
    function createErrorLi(err) {
      var timestampEl = span('timestamp', [ formatDate(new Date()) ]);
      var messageEl   = span('message',   [ err.message            ]);
      var metadataEl  = span('metadata',  ('lineNumber' in err)
                             && [ String(err.lineNumber) ]);
      var li          = createElement('li', {}, [ timestampEl,
                                                  messageEl,
                                                  metadataEl ]);

      return li;

      // Helpers
      function span(className, children) {
        return createElement('span', {className:className}, children)
          }

      function formatDate(date) {
        return [ date.getHours(),
                 date.getMinutes(),
                 date.getSeconds() ].map(pad2).join(":")

          // pads a number to two digits.
          function pad2(num) {
          return (num < 10 ? "0" : "") + num
            }
      }
    }
  };

  function createErrorConsole() {
    var ul        = createElement('ul');
    var container = createElement('div', {className:'error-console'}, [ ul ]);

    addStyle([
              ".error-console {",
              "  position: fixed;",
              "  top:      80%;",
              "  bottom:   0.5em;",
              "  left:     0.5em;",
              "  right:    0.5em;",
              "",
              "  overflow: auto;",
              "",
              "  border-radius: 0.4em;",
              "  background:    rgba(0,0,0, 0.8);",
              "  border:        1px solid #DDD;",
              "  box-shadow:    0 0 10px #000;",
              "  color:         #DDD;",
              "}",
              "",
              ".error-console ul {",
              "  list-style-type: none;",
              "  padding:         0.4em;",
              "  font-family:     monospace;",
              "}",
              "",
              ".error-console .timestamp::before { content: '['  }",
              ".error-console .timestamp::after  { content: '] ' }",
              ".error-console .timestamp, .error-console .metadata { color: #888 }",
              ".error-console .metadata          { float: right }",
              ].join("\n"));

    document.body.appendChild(container);

    return { ul:        ul,
        container: container }
  }

  function addStyle(css) {
    var style = createElement('style', {type:'text/css'});
    style.innerHTML = css;

    document.head.appendChild(style);
    return style;
  }

  // Creates an element, with optional parameters for attributes and children.
  // If `children` is given, `attrs` must also be given.  Strings in the
  // `children` array gets converted to string nodes.
  function createElement(name, attrs, children) {
    if (!attrs)    attrs    = {};
    if (!children) children = [];

    var el = document.createElement(name);
    extend(el, attrs);

    children.forEach(function(child) {
        if (typeof child == 'string')
          el.appendChild(document.createTextNode(child));

        else if (typeof child == 'object')
          el.appendChild(child);

        else
          throw new Error("createElement: invalid child: '" + child + "'.");
      });

    return el;

    // Performs a shallow copy of properties in `source` to `target`.
    function extend(target, source) {
      for (var k in source) {
        target[k] = source[k];
      }
    }
  }
}
