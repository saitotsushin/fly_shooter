import Enemy from '../Enemy';

export default class Bad extends Enemy {

  constructor(config) {

    super(config);

    this.anims.play('badAnime', true);

    this.body.setAllowGravity(false);  

    this.status = {
      hp: 1,
      power: 1,
      defense: 0,
      move_speed: 10
    }
    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.scene.add.text(10, 40, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    // this.debugText.setScrollFactor(0,0);
    
  }
  update(time, delta){
    /*==============================
    デバッグ START
    ==============================*/    
    // this.debugText.setText(
    //   [
    //     'targeted:'+this.isTargeted,
    //     'timer   :'+this.targetedDelayTimer,
    //   ]
    // );
    // this.debugText.x = this.x;
    // this.debugText.y = this.y + this.body.height;

    if(!this.active){
      return;
    }
    if(this.isTargeted){

      this.targetedDelayTimer -= delta;
      if(this.targetedDelayTimer <= 0){
        this.isTargeted = false;
      }
    }

    this.explodeSprite.x = this.x;
    this.explodeSprite.y = this.y;

    let playerPoint = this.scene.player.getCenter();
    let monsterPoint = this.getCenter();
    let { x,y } = playerPoint.subtract(monsterPoint);
    let moveVelocity = this.returnMax1(
      x,
      y
    );


    // this.run(x, y);
    this.setVelocityX(moveVelocity.x * this.status.move_speed);
    this.setVelocityY(moveVelocity.y * this.status.move_speed);    
  }

}