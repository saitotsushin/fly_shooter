import Item from './Item';

export default class Coin extends Item {
  constructor(config) {
    super(config);
    this.coinPoint = 1;

    this.body.setGravity(0, config.scene.game.config.physics.arcade.gravity.y * -1);


  }

  hit(){

    console.log("this.key",this.key)


    if(this.key === "coin_big"){
      this.scene.clearGameObj.open();
      return;
    }

    let coinCount = this.scene.registry.list.coin + this.coinPoint;
    this.scene.registry.set('coin', coinCount);

    this.destroy();
  }
}