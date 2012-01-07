theBoats = [];

function addBoat(boat)
{
  theBoats[theBoats.length] = boat;
}

(function() {
  function worldUpdate()
  {
    drawWorld();
    
    for (i=0; i<theBoats.length; i++) {
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
  
  function initStars() {
    stars = [];
    for (var i=0; i<50; i++) {
        stars.push({
           x: Math.random()*totalWidth,
           y: Math.random()*120,
	   size: Math.random()*3
        });
    }
  }
  
  function drawWorld() {
      if (!stars) initStars();
    
    function wave(x) {
      return Math.abs(Math.sin(x)*(x%Math.PI/6));
    }
    
    function drawWaveblock(y, color, waveOff) {
      context2D.fillStyle = color;
      context2D.beginPath();
      
      context2D.moveTo(0, y);
      for (var i=0; i<totalWidth; i++) {
	  context2D.lineTo(i, y+wave((i+waveOff)/30)*50);
      }
      //context2D.lineTo(totalWidth, waveHeight);
      context2D.lineTo(totalWidth, totalHeight);
      context2D.lineTo(0, totalHeight);
      context2D.closePath();
      
      context2D.fill();
    }
    
    context2D.fillStyle = "#111";
    context2D.fillRect(0, 0, totalWidth, totalHeight);
    
    for (var i=0; i<stars.length; i++) {
      var star = stars[i];
      circle(star.x, star.y, star.size/2, "#FFF");
    }
        
    for (var i=0; i<blues.length; i++) {
	drawWaveblock(waveHeight + i*60, blues[i], waveOffs[i]);
	waveOffs[i] += i+2;
    }
    
  }
  
  function drawWorldAfter() {
    var plankWidth = 40;
    
      /* Planks */
    context2D.beginPath();
    for (var i=0; i<5; i++) {
      context2D.moveTo((i+1)*plankWidth, 100);
      context2D.lineTo(i*plankWidth-1, totalHeight - 100);
      context2D.lineTo((i-1)*plankWidth, totalHeight - 100);
      context2D.lineTo(i*plankWidth+1, 100);
    }
    context2D.closePath();
    context2D.fillStyle = "#940";
    context2D.fill();
    
      /* Island */
    context2D.beginPath();
    context2D.moveTo(totalWidth, 70);
    context2D.quadraticCurveTo(totalWidth-70, totalHeight/2, totalWidth, totalHeight-50);
    context2D.closePath();
    context2D.fillStyle = "#C93";
    context2D.fill();
  }
})();