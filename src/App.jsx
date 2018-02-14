import React, { Component } from 'react';
import './App.css';
import Product from './components/product'

import image from './components/product/bergsjostolen.jpg';
import Missile from './components/product/missile.dae';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Product image={image} model={Missile}/>
      </div>
    );
  }
}

export default App;
