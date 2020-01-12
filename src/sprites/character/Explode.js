export default class Explode extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(
      config.scene,
      config.x,
      config.y
      // config.target
    );

    config.scene.add.existing(this);

    // this.setVisible(false);     
    this.on('animationcomplete', function() {
      // config.target.explode();
      this.destroy();

    },this);

  }

  update(time, delta) {

  }
  explode(){
    
  }
  setPlay(){
    // this.setVisible(true);  
    this.anims.play('explosionAnime_m', true);
  }
}