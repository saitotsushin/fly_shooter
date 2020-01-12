export default class Item extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.frame
    );
    this.key = config.key;
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    // this.setOrigin(1,1);


    this.active = true;
    this.visible = true;

  }

}