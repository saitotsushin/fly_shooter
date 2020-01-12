import 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';

let BASE_WIDTH = 192;
let BASE_HEIGHT = 288;
let DEVICE_WIDTH = window.innerWidth;
let DEVICE_HEIGHT = window.innerHeight;
let wd;
let hi;
if(DEVICE_WIDTH >= DEVICE_HEIGHT){
  wd = BASE_WIDTH;
  hi = BASE_HEIGHT;
}else{
  wd = BASE_WIDTH/DEVICE_WIDTH;
  hi = DEVICE_HEIGHT * wd;  
}
const config = {
  type: Phaser.WEBGL,
  pixelArt: true,
  // roundPixels: true,
  parent: 'content',
  width: BASE_WIDTH,
  height: hi,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            // debug: true
        }
    },
    scene: [
        BootScene,
        TitleScene,
        GameScene
    ]
};

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars
