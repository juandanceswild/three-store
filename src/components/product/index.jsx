import React from 'react';

import OrbitControls from 'three-orbitcontrols';
import ColladaLoader from 'three-collada-loader';
import OBJLoader from 'three-obj-loader';

import BTE from '../../lib/bte';
import productProp from '../../lib/CustomPropTypes/product';


const styles = require('./styles.module.css');

let THREE = require('three');

OBJLoader(THREE);

class Product extends React.Component {

  static propTypes = {
    product: productProp,
  }

  scene = null;
  camera = null;
  renderer = null;
  geometry = null;
  material = null;
  mesh = null;
  productModel = null;

  componentDidMount() {
    this.initialize();
    this.animate();

    BTE.on('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    BTE.remove('resize', this.onWindowResize);
  }

  state = {
    productLoaded: false,
  }

  onWindowResize = () => {
    const width  = this.container.clientWidth;
    const height = this.container.clientHeight

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  initialize() {

    const host = this.el;

    const width  = this.container.clientWidth;
    const height = this.container.clientHeight;

    const { image: background, model } = this.props.product;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.position.z = 10.0;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);

    // Backround globe
    let texture = new THREE.TextureLoader().load(background);
    //  Create a sphere of 10 width, length, and height. This is the big globe.
    this.geometry = new THREE.SphereGeometry( 500, 60, 40 );
    // Create a MeshBasicMaterial with a loaded texture - the background image.
    this.material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);

    let loader = new ColladaLoader();

    // .load is async
    loader.load(
      model,
      (collada) => {
        this.productModel = collada.scene;
        this.productModel.scale.set(1, 1, 1);
        this.productModel.rotation.z = Math.PI / 2;
        this.scene.add(this.productModel);
        this.setState({
          productLoaded: true,
        });
      },
      undefined
    );

    // Controls
    let controls = new OrbitControls(this.camera);
    controls.enablePan = false;
    controls.enableZoom = false; 
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    host.addEventListener('mousewheel', this.onMouseWheel, false);
    host.addEventListener('DOMMouseScroll', this.onMouseWheel, false);

    this.renderer.setSize( window.innerWidth, window.innerHeight );
 
    host.appendChild( this.renderer.domElement );
  }

  animate() {
      requestAnimationFrame( this.animate.bind(this) );

      if (this.state.productLoaded) {
        this.productModel.rotation.z += 0.001;
        this.productModel.rotation.x += 0.005;
      }

      this.renderer.render( this.scene, this.camera ); 
  }

  onMouseWheel = (event) => {
    event.preventDefault();
    if (event.wheelDeltaY) { // WebKit
      this.camera.fov -= event.wheelDeltaY * 0.05;
    } else if (event.wheelDelta) { // Opera / IE9
      this.camera.fov -= event.wheelDelta * 0.05;
    } else if (event.detail) { // Firefox
      this.camera.fov += event.detail * 1.0;
    }

    this.camera.fov = Math.max(40, Math.min(100, this.camera.fov));
    this.camera.updateProjectionMatrix();
  }

  render() {
    const { description } = this.props.product;

    return (
      <div className={styles.container} ref={(e) => { this.container = e; }}>
        <div className={styles.threeHolder} ref={el => this.el = el} />
        <div className={styles.description}>
          <span>{description}</span>
          <a className={styles.cartLink}>Add to cart</a>
        </div>
      </div>
    )
  }
}

export default Product