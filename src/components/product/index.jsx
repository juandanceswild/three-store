import React from 'react';
import PropTypes from 'prop-types';

import OrbitControls from 'three-orbitcontrols';
import ColladaLoader from 'three-collada-loader';
import OBJLoader from 'three-obj-loader';

import BTE from '../../lib/bte';

const styles = require('./styles.scss');

let THREE = require('three');
let scene, camera, renderer;
let geometry, material, mesh; 
let productModel;

OBJLoader(THREE);


class Product extends React.Component {

  static propTypes = {
    image: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    product: PropTypes.shape({
      description: PropTypes.String,
    })
  }

  componentDidMount() {
    this.initialize();
    this.animate();
    BTE.on('resize', this.onWindowResize);

    console.log(styles.description);
  }

  componentWillUnmount() {
    BTE.remove('resize', this.onWindowResize);
  }

  state = {
    productLoaded: false,
  }

  onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  initialize() {

    const host = this.el;

    const width  = window.innerWidth;
    const height = window.innerHeight;

    const { image: background, model } = this.props;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 1000);
    camera.position.z = 100.0;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    // Backround globe
    let texture = new THREE.TextureLoader().load(background);
    //  Create a sphere of 10 width, length, and height. This is the big globe.
    geometry = new THREE.SphereGeometry( 100, 32, 32 );
    // Create a MeshBasicMaterial with a loaded texture - the background image.
    material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    let loader = new ColladaLoader();

    // .load is async
    loader.load(
      model,
      (collada) => {
        productModel = collada.scene;
        productModel.scale.set(10, 10, 10);
        productModel.rotation.z = Math.PI / 2;
        scene.add(productModel);
        this.setState({
          productLoaded: true,
        });
      },
      undefined
    );

    // Controls
    let controls = new OrbitControls(camera);
    controls.enablePan = false;
    controls.enableZoom = false; 
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    host.addEventListener('mousewheel', this.onMouseWheel, false);
    host.addEventListener('DOMMouseScroll', this.onMouseWheel, false);

    renderer.setSize( window.innerWidth, window.innerHeight );
 
    host.appendChild( renderer.domElement );

    console.log(scene);
  }

  animate() {
      requestAnimationFrame( this.animate.bind(this) );

      if (this.state.productLoaded) {
        productModel.rotation.z += 0.001;
        productModel.rotation.x += 0.005;
      }

      renderer.render( scene, camera ); 
  }

  onMouseWheel = (event) => {
    event.preventDefault();
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

  render() {
    const { description } = this.props.product;

    return (
      <div>
        <div className="threeHolder" ref={el => this.el = el} />
        <div className={styles.description}>{description}</div>
      </div>
    )
  }
}

export default Product