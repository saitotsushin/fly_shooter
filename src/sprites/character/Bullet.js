
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

    this.body.setAllowGravity(false);  
    
    this.shotSpeed = 100;

    this.breakTime = 0;
    this.breakTimeMax = 2000;

    this.vx = 0;
    this.vy = 0;

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
      this.body.setVelocity(this.vx,this.vy);
    }
  }
  shot(power,x,y,vx,vy,speed){

    this.shotSpeed = speed ? speed : this.shotSpeed;

    this.power = power ? power : this.power;

    this.x = x;
    this.y = y;
    this.vx = vx * this.shotSpeed;
    this.vy = vy * this.shotSpeed;


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
