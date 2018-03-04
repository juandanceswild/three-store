import React, { Component } from 'react';
import Product from './components/Product'

import BTE from './lib/bte';

// import image from './assets/bergsjostolen.jpg';
import image from './assets/backgrounds/beaucastle.jpg';
import Missile from './assets/missile.dae';

const styles = require('./app.module.css');

const product = {
	image,
	model: Missile,
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu purus eget massa dapibus gravida. Proin eu quam dui."
}

class App extends Component {

	componentDidMount() {
		BTE.monitorResize();
	}

  render() {
    return (
      <div className={styles.container}>
        <Product product={product}/>
      </div>
    );
  }
}

export default App;

