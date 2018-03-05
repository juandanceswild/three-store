import castle from './assets/backgrounds/beaucastle.jpg';
import church from './assets/backgrounds/church.jpg';
import greenforest from './assets/backgrounds/greenforest.jpg';

import Missile from './assets/models/missile.dae';
import Chur from './assets/models/chur.json';
// import Rose from './assets/models/rose-dae/rose.dae';
import Rose from './assets/models/rose/rose.json';

import roseTexture from './assets/models/rose/rose_texture.jpg';


export default () => {
  Rose.geometries[0].materials[0].mapDiffuse = roseTexture;
  Rose.images[0].url = roseTexture;
  Rose.images[0].name = roseTexture;

  return [
    {
      image: castle,
      id: "01",
      model: Missile,
      scale: {
        x: .5,
        y: .5,
        z: .5,
      },
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu purus eget massa dapibus gravida. Proin eu quam dui.",
    },
    {
      image: church,
      id: "02",
      model: Chur,
      scale: {
        x: 0.5,
        y: 0.5,
        z: 0.5,
      },
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu purus eget massa dapibus gravida. Proin eu quam dui.",
    },
    {
      image: greenforest,
      id: "03",
      model: Rose,
      scale: {
        x: 0.1,
        y: 0.1,
        z: 0.1,
      },
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu purus eget massa dapibus gravida. Proin eu quam dui.",
    }
  ]
}