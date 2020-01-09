
export default class Bullet extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(
      config.scene,
      config.x,
      config.y,
      config.key,
      config.frame
    );

    this.power = 1;


    this.active = false;

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.body.setGravity(0, config.scene.game.config.physics.arcade.gravity.y * -1);
    
    this.speed = 100;



    this.breakTime = 0;
    this.breakTimeMax = 2000;

  }

  update(time, delta) {
    if(!this.active){
      this.body.setVelocity(0,0);
      return;
    }
    if(this.breakTime < 0){
      this.explode();  
      return;
    }


    if(this.active){
      this.breakTime -= delta;
      this.body.setVelocityX(this.speed);
    }
  }
  shot(power,x,y,scroll_speed){


    this.power = power ? power : this.power;

    this.x = x;
    this.y = y;

    this.speed += scroll_speed;

    this.breakTime = this.breakTimeMax;

    this.setActive(true);
    this.setVisible(true);

  }

  explode() {

    this.setVisible(false);
    this.setActive(false);
 
    this.body.setVelocity(0,0);

  }

}
