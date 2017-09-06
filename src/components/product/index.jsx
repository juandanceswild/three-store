import React from 'react';
import image from './bergsjostolen.jpg';
import checkered from './checkered.png';
// import reiAsset from './Rei.obj';
import Missile from './missile.dae';

import OrbitControls from 'three-orbitcontrols';
import ColladaLoader from 'three-collada-loader';
import OBJLoader from 'three-obj-loader';


var THREE = require('three');

OBJLoader(THREE);

console.log(typeof THREE.OBJLoader);


class Product extends React.Component {

  componentDidMount() {
    var scene = initThreeProduct(this.el);
    console.log(scene);
  }

  render() {
    return (
      <div>
        <div className="threeHolder" ref={el => this.el = el} />
      </div>
    )
  }
}


function initThreeProduct(hostElement) {

  var scene, camera, renderer;
  var geometry, material, sphere, cube, mesh, rei;   

  function initialize() {

    var width  = window.innerWidth,
        height = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 1000);
    camera.position.z = 100.0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    var texture = new THREE.TextureLoader().load(image);

    // SPHERE
    //  Create a sphere of 10 width, length, and height
    geometry = new THREE.SphereGeometry( 100, 32, 32 );
    // Create a MeshBasicMaterial with a loaded texture
    material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );


    mesh = new THREE.Mesh(geometry, material);

    // scene.add( sphere );
    scene.add(mesh);

    // // CUBE
    // geometry = new THREE.BoxGeometry( 5, 5, 5 );
    // material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
 
    // cube = new THREE.Mesh( geometry, material );
    // cube.position.z = -7;
 
    // scene.add(cube);

    //REI

    // var loader = new THREE.OBJLoader();
    // loader.load(
    //   reiAsset,
    //   (obj) => {
    //     rei = obj;
    //     console.log(rei);
    //     // const rei = obj.scene;
    //     obj.scale.set(40, 40, 40);
    //     // rei.position.y = -1;
    //     rei.rotation.z = Math.PI / 2;
    //     rei.position.x = 0.7;
    //     scene.add(obj);
    //   },
    //   undefined
    // );

    var loader = new ColladaLoader();
    loader.load(
      Missile,
      (collada) => {
        rei = collada.scene;
        console.log('loaded', rei);
        rei.scale.set(20, 20, 20);
        // // rei.position.y = -1;
        // rei.rotation.z = Math.PI / 2;
        // rei.position.x = 0.7;
        scene.add(rei);
      },
      undefined
    );

    // Controls
    var controls = new OrbitControls(camera);
    controls.enablePan = false;
    controls.enableZoom = false; 
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    hostElement.addEventListener('mousewheel', onMouseWheel, false);
    hostElement.addEventListener('DOMMouseScroll', onMouseWheel, false);

    renderer.setSize( window.innerWidth, window.innerHeight );

 
    hostElement.appendChild( renderer.domElement );
   
  }

  initialize();

  function animate() {
   
      requestAnimationFrame( animate );

      // sphere.rotation.x += 0.001;
      // sphere.rotation.y += 0.002;

      if (rei) {
        // rei.rotation.z += 0.01;
        // rei.rotation.x += 0.05;
      }

      renderer.render( scene, camera );
   
  }

  animate();

  function onMouseWheel(event) {
    event.preventDefault();
    console.log('inside mousewheel');
    if (event.wheelDeltaY) { // WebKit
      camera.fov -= event.wheelDeltaY * 0.05;
    } else if (event.wheelDelta) { // Opera / IE9
      camera.fov -= event.wheelDelta * 0.05;
    } else if (event.detail) { // Firefox
      camera.fov += event.detail * 1.0;
    }

    camera.fov = Math.max(40, Math.min(100, camera.fov));
    camera.updateProjectionMatrix();
  }

  return scene;
}

export default Product