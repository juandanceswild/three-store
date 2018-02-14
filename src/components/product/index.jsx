import React from 'react';
import PropTypes from 'prop-types';

import checkered from './checkered.png';
// import reiAsset from './Rei.obj';
import Missile from './missile.dae';

import OrbitControls from 'three-orbitcontrols';
import ColladaLoader from 'three-collada-loader';
import OBJLoader from 'three-obj-loader';


var THREE = require('three');

OBJLoader(THREE);

// console.log(typeof THREE.OBJLoader);


class Product extends React.Component {

  static propTypes = {
    image: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const { image, model } = this.props;
    var scene = initThreeProduct(this.el, image, model);
  }

  render() {
    return (
      <div>
        <div className="threeHolder" ref={el => this.el = el} />
      </div>
    )
  }
}


function initThreeProduct(hostElement, background, model) {

  var scene, camera, renderer;
  var geometry, material, mesh; 
  var productModel;
  // var sphere, cube, rei;  

  var shown = false;

  function initialize() {

    var width  = window.innerWidth,
        height = window.innerHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 1000);
    camera.position.z = 100.0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    var texture = new THREE.TextureLoader().load(background);

    // SPHERE
    //  Create a sphere of 10 width, length, and height
    geometry = new THREE.SphereGeometry( 100, 32, 32 );
    // Create a MeshBasicMaterial with a loaded texture
    material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );


    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    var loader = new ColladaLoader();
    loader.load(
      model,
      (collada) => {
        productModel = collada.scene;
        // console.log('loaded', model);
        productModel.scale.set(20, 20, 20);
        // // rei.position.y = -1;
        productModel.rotation.z = Math.PI / 2;
        scene.add(productModel);
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

      if (productModel && !shown) {
        console.log('model is', productModel);
        productModel.rotation.z += 0.1;
        productModel.rotation.x += 0.05;
        shown = true;
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