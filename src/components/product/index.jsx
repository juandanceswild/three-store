import React from 'react';

import OrbitControls from 'three-orbitcontrols';
import ColladaLoader from 'three-collada-loader';
import OBJLoader from 'three-obj-loader';

import BTE from '../../lib/bte';
import productProp from '../../lib/CustomPropTypes/product';


//todo - one renderer, multiple scenes with cameras -- multiple viewports https://threejs.org/examples/webgl_multiple_views.html

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
    // console.log(this.container, this.container.clientWidth, this.container.clientHeight);
    this.initialize();
    this.animate();

    BTE.on('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    BTE.remove('resize', this.onWindowResize);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.product.id !== this.props.product.id) {
      this.el.removeChild( this.renderer.domElement );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.product.id !== this.props.product.id) {
      console.log('going to init');
      this.setState({
        productLoaded: false,
      })
      this.initialize();
    }
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
    // console.log(model);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.position.z = 10.0;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    // console.log('initializing', this.container, 'with', width, height);

    // Backround globe
    let texture = new THREE.TextureLoader().load(background);
    //  Create a sphere of 10 width, length, and height. This is the big globe.
    this.geometry = new THREE.SphereGeometry( 500, 60, 40 );
    // Create a MeshBasicMaterial with a loaded texture - the background image.
    this.material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.BackSide } );

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);

    console.log(model);

    if (typeof model === 'object') this.loadJson();
    else if (typeof model === 'string') this.loadCollada();

    // Controls
    let controls = new OrbitControls(this.camera);
    controls.enablePan = false;
    controls.enableZoom = false; 
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    host.addEventListener('mousewheel', this.onMouseWheel, false);
    host.addEventListener('DOMMouseScroll', this.onMouseWheel, false);
 
    host.appendChild( this.renderer.domElement );
  }

  loadCollada() {
    const { model, scale } = this.props.product;
    const colladaLoader = new ColladaLoader();

    // .load is async
    colladaLoader.load(
      model,
      (o) => {
        this.productModel = o.scene;
        this.productModel.scale.set(scale.x, scale.y, scale.z);
        this.productModel.rotation.z = Math.random() * Math.PI / 2;
        this.scene.add(this.productModel);
        this.setState({
          productLoaded: true,
        });
      },
      undefined
    );
  }

  loadJson() {
    const { model, scale } = this.props.product;
    const loader = new THREE.ObjectLoader();

    loader.parse(model,
      (o) => {
        console.log('loaded', o);
        this.productModel = o;
        this.productModel.scale.set(scale.x, scale.y, scale.z);
        this.productModel.position.x += 3;
        this.productModel.rotation.z = Math.random() * Math.PI / 2;
        this.scene.add(this.productModel);
        console.log(this.productModel.texturePath);
        this.setState({
          productLoaded: true,
        }); 
      },
      undefined
    );
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