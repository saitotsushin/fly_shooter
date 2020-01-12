import Enemy from '../Enemy';
import Bullet from '../Bullet';

export default class Brain extends Enemy {

  constructor(config) {

    super(config);

    this.status = {
      hp: 20,
      power: 1,
      defense: 1,
      move_speed: 4
    }
    this.attackingTimerEvent;
    this.direction = {
      x: 0,
      y: 0
    }  

    this.bulletGroup = this.scene.add.group(); 


    config.scene.physics.add.collider(
      this, 
      config.scene.groundLayer,
      this.tileCollision,
      null,
      this
    );

    config.scene.physics.add.collider(
      this.bulletGroup,
      config.scene.groundLayer,
      function(bullet,layer){
        bullet.explode();
      },
      null,
      this
    );


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

    if(this.isTargeted){

      this.targetedDelayTimer -= delta;
      if(this.targetedDelayTimer <= 0){
        this.isTargeted = false;
      }
    }

    if(!this.active){
      if(this.attackingPlayerTimerEvent){
        this.attackingPlayerTimerEvent.remove(false);
        this.attackingPlayerTimerEvent = null;
      }
      return;
    }


    this.bulletGroup.children.entries.forEach(
      (sprite) => {
        sprite.update(time, delta);
      }
    );
    this.scene.physics.add.overlap(
      this.bulletGroup,
      this.scene.player,
      this.bulletCollision,
      false,
      this
    );

    this.explodeSprite.x = this.x;
    this.explodeSprite.y = this.y;

    let playerPoint = this.scene.player.getCenter();
    let monsterPoint = this.getCenter();
    let { x,y } = playerPoint.subtract(monsterPoint);
    let moveVelocity = this.returnMax1(
      x,
      y
    );

    this.direction.x = moveVelocity.x;
    this.direction.y = moveVelocity.y;




    this.setVelocityX(this.direction.x * this.status.move_speed);
    this.attackingPlayerTimerEvent = this.scene.time.addEvent({
      delay: 0,
      callback: this.attack,
      callbackScope: this,
      repeat: Infinity
    });
  }
  attack(){
    if (!this.active) {
      return;
    }

    if(this.attackingTimerEvent){
      return;
    }else{
      this.attackingTimerEvent = this.scene.time.addEvent({
        delay: 3000,
        callback: function(){
          this.attackingTimerEvent.remove(false);
          this.attackingTimerEvent = null;
        },
        callbackScope: this,
        repeat: 0
      });  
    }

    let bullet = {
      vx: this.direction.x,
      vy: this.direction.y
    }

    this.fromShotPool(bullet);

  }
  createShot(object){    
    let bullet = new Bullet({
      scene: this.scene,
      x: this.x,
      y: this.y,
      key: "bullet"
    }); 
    this.bulletGroup.add(bullet);
  }
  fromShotPool(object){
    let bullet = this.bulletGroup.getFirst();
    if(!bullet){
      this.createShot();
      bullet = this.bulletGroup.get()
    }

    bullet.x = this.x;
    bullet.y = this.y;
    bullet.vx = object.vx;
    bullet.vy = object.vy;
    bullet.shot(
      this.status.power,
      bullet.x,
      bullet.y,
      bullet.vx,
      bullet.vy
    );
  }
  tileCollision(obj){
    this.isGround = true;
  }
  bulletCollision(bullet,player){
    if(!bullet.active){
      return;
    }
    if(!player.active){
      return;
    }

    bullet.explode();
    
    player.damage(this.status.power);

    if(player.status.hp <= 0){
      player.explode();
    }
  }
}