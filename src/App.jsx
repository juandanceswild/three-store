import React, { Component } from 'react';
import './App.css';
import Product from './components/product'

import BTE from './lib/bte';

import image from './assets/bergsjostolen.jpg';
import Missile from './assets/missile.dae';


const product = {
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu purus eget massa dapibus gravida. Proin eu quam dui."
}

class App extends Component {
	componentDidMount() {
		BTE.monitorResize();
	}

  render() {
    return (
      <div className="App">
        <Product image={image} model={Missile} product={product}/>
      </div>
    );
  }
}

export default App;
