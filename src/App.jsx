import React, { Component } from 'react';

import Product from './components/Product'
import Navigation from './components/Navigation';

import BTE from './lib/bte';

import productsData from './productsData';

const styles = require('./app.module.css');

class App extends Component {

	componentDidMount() {
		BTE.monitorResize();
	}

  state = {
    activeProduct: productsData()[0],
  }

  setActiveProduct = (product) => {
    console.log('changing the product to', product);
    this.setState({
      activeProduct: product
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <Navigation setActiveProduct={this.setActiveProduct} products={productsData()}/>
        <Product product={this.state.activeProduct}/>
      </div>
    );
  }
}

export default App;
