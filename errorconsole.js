(function() {
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
})()
