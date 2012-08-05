Spelprogrammering med JavaScript och Canvas - Game development with JavaScript and Canvas
=========================================================================================

Usage of simple.js:
------------------

Create an html file containing this:

    <script src="http://spelprogrammering.nu/simple.js">
      function start()
      {
        circle(130, 100, 550, "yellow");
        rectangle(450, 0, 600, 400, "blue");
        circle(200, 150, 70, "red");
        triangle(300, 20, 180, 700, 600, 400, "green");
        ring(400, 200, 100, 10, "gray");
        line(20, 20, 1750, 900, 10, "brown");
        arc(500, 500, 300, 70, 20, "pink");
      }
      function update()
      {
        circle(mouse.x, mouse.y, 30, "red");
      }
    </script>

...and you will see different types of shapes and be able to paint with the mouse. No extra HTML is required which makes it possible for beginners to start coding at once!

Usage of advanced.js:
---------------------

Create an html file containing this:

    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <canvas style="border: 1px solid red" id="one" width="800" height="200"></canvas>
        <br />
        <canvas style="border: 1px solid blue;" id="two" width="800" height="200"></canvas>
    
        <script type="text/javascript" src="http://spelprogrammering.nu/advanced.js"></script>
        <script type="text/javascript">
          
          a = new RoboroCanvas('one');
          b = new RoboroCanvas('two');
    
          a.update = function()
          {
            a.circle(a.mouse.x, a.mouse.y, a.mouse.left ? 10 : 2, "brown");
          };
           
          b.update = function()
          {
            b.circle(b.mouse.x, b.mouse.y, b.mouse.left ? 10 : 2, "yellow");
          };
    
        </script>
      </body>
    </html>
