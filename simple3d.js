function initDOM()
{
    var div = document.createElement('div');
    div.innerHTML = '<div id="instructions"><span style="font-size:40px">Klicka med musen!</span></div>';
    div.setAttribute('id', 'blocker');
    document.body.appendChild(div);
    
    var head    = document.getElementsByTagName('head')[0];
    var iOSMeta = document.createElement('meta');
    
    iOSMeta.name    = "apple-mobile-web-app-capable";
    iOSMeta.content = "yes";
    head.appendChild(iOSMeta);
    
    var viewport = document.createElement('meta');
    
    viewport.name    = "viewport";
    viewport.content = "width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0";
    head.appendChild(viewport);
    
    var html = document.querySelector('html');
    html.style.width = "100%";
    html.style.height = "100%";
    
    var body = document.querySelector('body');
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.backgroundColor = "#ffffff";
    body.style.margin = "0";
    body.style.overflow = "hidden";

    var blocker = document.querySelector('#blocker');
    blocker.style.position = "absolute";
    blocker.style.width = "100%";
    blocker.style.height = "100%";
    blocker.style.backgroundColor = "rgba(0,0,0,0.5)";

    var instructions = document.querySelector('#instructions');
    instructions.style.width = "100%";
    instructions.style.height = "100%";
    instructions.style.color = "#ffffff";
    instructions.style.display = "-webkit-box";
    instructions.style.display = "-moz-box";
    instructions.style.display = "box";

    instructions.style.boxOrient = "horizontal";
    instructions.style.MozBoxOrient = "horizontal";
    instructions.style.webkitBoxOrient = "horizontal";

    instructions.style.boxPack = "center";
    instructions.style.MozBoxPack = "center";
    instructions.style.webkitBoxPack = "center";

    instructions.style.boxAlign = "center";
    instructions.style.MozBoxAlign = "center";
    instructions.style.webkitBoxAlign = "center";

    instructions.style.textAlign = "center";

    instructions.style.cursor = "pointer";
}

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

function simplify()
{
  k = new RoboroKeyboard();
  window.keyboard = k;

  var theCanvas = document.querySelector('canvas');
  theCanvas.setAttribute("id", "theCanvas");

  roboroCanvas = new RoboroCanvas("theCanvas");
  
  window.touchscreen = roboroCanvas.touchscreen;
  window.gps = roboroCanvas.gps;

  importMethods(window, Math, ["sin", "cos", "tan", "asin", "acos", "atan", "round",
			       "sqrt", "floor", "ceil", "PI", "abs", "pow"], true);

  var functions =
    ["random",
     "randomAlternative",
     "store",
     "load",
     "startGPS",
     "stopGPS",
     "distanceGeoCoord",
     "calculateGeoCoord",
     "randomGeoCoord"];
  
  importMethods(window, roboroCanvas, functions);

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
}

window.onload = function() 
{
  loadScript("https://www.koda.nu/libs/threejs/three83.js", 
	     function()
             {
	       loadScript("https://www.koda.nu/libs/threejs/pointerlock.js", 
			  function()
			  {
			    loadScript("https://www.koda.nu/libs/threejs/objloader.js", loadTheRest);
			  });
	     });
}

function loadTheRest()
{
  initDOM(); 

  loadScript("https://www.koda.nu/advanced.js", simplify);

  var camera, scene, renderer;
  var controls;

  var blocker = document.getElementById( 'blocker' );
  var instructions = document.getElementById( 'instructions' );
  
  var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

  if (havePointerLock) 
  {
    var element = document.body;
    var pointerlockchange = function ( event ) 
    {
	if (document.pointerLockElement === element || 
	    document.mozPointerLockElement === element || 
	    document.webkitPointerLockElement === element ) 
	{
	  controls.enabled = true;
	  blocker.style.display = 'none';
	} 
	else 
	{
	  controls.enabled = false;
	  blocker.style.display = '-webkit-box';
	  blocker.style.display = '-moz-box';
	  blocker.style.display = 'box';
	  instructions.style.display = '';
	}
	
    };

    var pointerlockerror = function ( event ) 
    {
	instructions.style.display = '';
    };

    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
    
    instructions.addEventListener( 'click', function ( event ) 
    {
	instructions.style.display = 'none';
	element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
	element.requestPointerLock();
    }, false );
  } 
  else 
  {
    instructions.innerHTML = 'Det verkar vara problem';
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  }

  init();

  function init() 
  {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    scene = new THREE.Scene();
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    controls.getObject().translateZ(1000);
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize() 
  {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function render3D()
  {
    renderer.render(scene, camera);
  }

  // Lights

  function pointLight(x, y, z, color, intensity)
  {
    var tPointLight = new THREE.PointLight(color);

    tPointLight.position.x = x;
    tPointLight.position.y = y;
    tPointLight.position.z = z;
    
    scene.add(tPointLight);
    tPointLight.intensity = intensity;
    
    return tPointLight;
  }
  
  function ambientLight(color)
  {
    var ambLight = new THREE.AmbientLight(color);
    scene.add(ambLight);
    return ambLight;
  }
  

  // Shapes
  
  function box(x, y, z, width, height, depth, mat, rx, ry)
  {
    var material = new THREE.MeshPhongMaterial({ color: mat });
    
    if (typeof mat === 'string' || mat instanceof String)
    {
      if (mat.search(/http/) != -1)
      {
        var texture = THREE.ImageUtils.loadTexture(mat);
        if ((typeof rx !== 'undefined') && (typeof ry !== 'undefined'))
        {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(rx, ry);
        }
        material = new THREE.MeshPhongMaterial( { map: texture } );
      }
    }
  
    var geometry = new THREE.BoxGeometry( width, height, depth );
  
    material.side = THREE.DoubleSide;
    
    var tBox = new THREE.Mesh(geometry, material);
    scene.add(tBox);
    tBox.position.x = x;
    tBox.position.y = y;
    tBox.position.z = z;
    
    return tBox;
  }
  
  function sphere(x, y, z, r, mat, rx, ry, detail)
  {
    var material = new THREE.MeshPhongMaterial({ color: mat });
  
    if (typeof mat === 'string' || mat instanceof String)
    {
      if (mat.search(/http/) != -1)
      {
        var texture = THREE.ImageUtils.loadTexture(mat);
        if ((typeof rx !== 'undefined') && (typeof ry !== 'undefined'))
        {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(rx, ry);
        }
        material = new THREE.MeshPhongMaterial( { map: texture } );
      }
    }
  
    var detail = typeof detail !== 'undefined' ?  b : 32;
    var geometry = new THREE.SphereGeometry(r, detail, detail);
  
    material.side = THREE.DoubleSide;
    
    var tSphere = new THREE.Mesh(geometry, material);
    scene.add(tSphere);
    tSphere.position.x = x;
    tSphere.position.y = y;
    tSphere.position.z = z;
    
    return tSphere;
  }
  
  
  function tetrahedron(x, y, z, r, mat, rx, ry)
  {
    var material = new THREE.MeshPhongMaterial({ color: mat });
  
    if (typeof mat === 'string' || mat instanceof String)
    {
      if (mat.search(/http/) != -1)
      {
        var texture = THREE.ImageUtils.loadTexture(mat);
        if ((typeof rx !== 'undefined') && (typeof ry !== 'undefined'))
        {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(rx, ry);
        }
        material = new THREE.MeshPhongMaterial( { map: texture } );
      }
    }
  
    var geometry = new THREE.TetrahedronGeometry(r);
    geometry.applyMatrix( new THREE.Matrix4().makeRotationAxis( new THREE.Vector3( 1, 0, -1 ).normalize(), Math.atan( Math.sqrt(2)) ) );
  
    material.side = THREE.DoubleSide;
    
    var tTetrahedron = new THREE.Mesh(geometry, material);
    scene.add(tTetrahedron);
    tTetrahedron.position.x = x;
    tTetrahedron.position.y = y;
    tTetrahedron.position.z = z;
    
    return tTetrahedron;
  }
  
  function moveCameraX(x)
  {
    controls.getObject().translateX(x);
  }

  function moveCameraY(y)
  {
    controls.getObject().translateY(y);
  }

  function moveCameraZ(z)
  {
    controls.getObject().translateZ(z);
  }

  function loadModel(x, y, z, modelURL, textureURL)
  {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) { console.log(item, loaded, total); };
    
    var texture = new THREE.Texture();
    var loader = new THREE.ImageLoader(manager);
    loader.load(textureURL, function (image) 
    {
	texture.image = image;
	texture.needsUpdate = true;
    } );

    var result = new THREE.Object3D();
    scene.add(result);

    var loader = new THREE.OBJLoader(manager);
    loader.load(modelURL, function (object) 
    {	   
	object.traverse( function (child) 
			 {
			   if ( child instanceof THREE.Mesh ) { child.material.map = texture; }
			 } );
	
	object.position.x = x;
	object.position.y = y;
	object.position.z = z;

      result.add(object);
    });

    return result;
  }
  
  function update() {}
  
  var elems = document.getElementsByTagName('script')

  for (var i=0; i<elems.length; i++)
  {
    var el = elems[i];
    
    if (el.src.match(/simple3d\.js$/))
	eval(el.innerHTML);
  }

  function animate() 
  {
    requestAnimationFrame(animate);
    update();
    render3D();
  }
  
  animate();
    
}

