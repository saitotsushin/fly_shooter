import Bullet from './Bullet';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(
      config.scene,
      config.x,
      config.y,
      config.key
    );

    console.log(this)
    config.scene.anims.create({
      key: 'run',
      frames: config.scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });  
    config.scene.anims.create({
      key: 'wait',
      frames: config.scene.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    }); 
    // this.scene = config.scene;

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.status = {
      power: 10
    };
    this.jumpTimer = 0;
    this.jumpCount = 0;
    this.jumpCountMax = 2;
    this.isJumping = false;
    this.shotTimer = 0;
    this.isShot = false;
    this.isGround = false;

    this.MOVE_SPEED = 80;  
    
    this.ADD_MOVE_VECTOR = 120;   

    this.isSearch = false;

    this.isJumpingReleased = false;


    this.arrowDegree = 0;
    this.arrowDegreeBase = 90;
    this.arrowRadius = 40;

    this.weapon = this.scene.add.sprite(this.x, this.y, 'bullet');
    this.weapon.setOrigin(0.5,0.5);
    this.weapon.setActive(false);
    this.weapon.setVisible(false);
    this.weaponDegree = 0;
    this.weaponDegreeBase = 180;
    this.weaponRadius = 30; 
    this.weaponDegreeDirection = '';   


    this.moveVelocity = {
      x: 0,
      y: 0
    };

    this.isMove = false;

    this.keyReleaseCount = 0;

    this.arrow_line = this.scene.add.graphics({ lineStyle: { width: 1, color: 0xFF0000 } });
    this.arrow_line.lineStyle(2, 0xFFFFFF);
    this.arrow_line_pos = {
      x: 0,
      y: 0
    }

    config.scene.physics.add.collider(
      this, 
      config.scene.groundLayer,
      this.tileCollision,
      null,
      this
    );
    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.scene.add.text(10, 40, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);

  }

  update(keys, time, delta) {

    this.debugText.setText(
      [
        'keys.isTOUCH  :'+keys.isTOUCH,
        'keys.isRELEASE:'+keys.isRELEASE
      ]
    );


    this.anims.play("wait", true);



    if(this.x <= this.width*0.5
      || this.scene.map.widthInPixels <= (this.x + this.width*0.5)){
      this.body.setVelocityX(0);
      // return;
    }
    if(this.y <= this.height*0.5){
      this.body.setVelocityY(0);
      // return;
    }

    if(keys.isTOUCH === true){
      if(this.isJumpingReleased){
        this.search(keys);
      }else{
        this.jump(keys);
      }
      if(keys.LEFT){
        this.weaponDegreeDirection = 'left';
        
      }
      if(keys.RIGHT){
        this.weaponDegreeDirection = 'right';
        
      }

    }
    if(this.isGround){
      this.weapon.setVisible(false);
      this.weapon.setActive(false);
      this.weaponDegree = this.weaponDegreeBase;
    }else{
      this.attack();
    }


    if(this.shotTimer > 0){
      this.shotTimer -= delta;
    }else{
      this.isShot = false;
    }

    if(keys.isRELEASE === true){

      this.arrowDegree = this.arrowDegreeBase;

      if(!this.isJumpingReleased){
        this.isJumping = false;
        this.isJumpingReleased = true;
        this.keyReleaseCount++;
      }else{
        this.body.setAllowGravity(true);  

        this.arrow_line.setVisible(false);
        this.arrow_line.setActive(false);
        
      }
      if(this.keyReleaseCount === 1 && this.isSearch){
        this.keyReleaseCount++;
      }
      if(this.keyReleaseCount > 1 && !this.isGround){
        
        this.move();
      }
    }


    if(this.jumpTimer > 0 && !this.isSearch){
      this.jumpTimer -= delta;
    }

    this.isGround = false;

  }
  attack(){
    if(!this.weaponDegreeDirection){
      return;
    }
    if(this.weaponDegreeDirection === 'left'){
      this.weaponDegree += 0.15;
    }
    if(this.weaponDegreeDirection === 'right'){
      this.weaponDegree -= 0.15;
    }
    this.weapon.setVisible(true);
    this.weapon.setActive(true);
    this.weapon.x = this.x + Math.cos(this.weaponDegree)*this.weaponRadius;
    this.weapon.y = this.y + Math.sin(this.weaponDegree)*this.weaponRadius;
  }
  move(){
    if(!this.isMove){
      this.moveVelocity = this.returnMax1(
        this.arrow_line_pos.x - this.x,
        this.arrow_line_pos.y - this.y
      )
      if(this.moveVelocity.y < 0){
        // this.moveVelocity.x = this.moveVelocity.x * 1.5;
        this.moveVelocity.y = this.moveVelocity.y * 1.5;
      }
      this.body.setVelocity(
        this.moveVelocity.x * this.ADD_MOVE_VECTOR,
        this.moveVelocity.y * this.ADD_MOVE_VECTOR
      )
    }
    this.isMove = true;

  }
  search(keys) {

    this.isSearch = true;

    this.isMove = false;

    
    this.body.setVelocity(0,0);
    this.body.setAllowGravity(false);
    this.arrow_line.setVisible(true);
    this.arrow_line.setActive(true);
    this.arrow_line.clear();


    if(keys.LEFT){
      this.arrowDegree += 0.15;
    }
    if(keys.RIGHT){
      this.arrowDegree -= 0.15;
    }

    this.arrow_line_pos.x = this.x + Math.cos(this.arrowDegree)*this.arrowRadius;
    this.arrow_line_pos.y = this.y + Math.sin(this.arrowDegree)*this.arrowRadius;
    this.arrow_line.lineBetween(
      this.x,
      this.y,
      this.arrow_line_pos.x,
      this.arrow_line_pos.y
    );
    // this.arrow.x = this.x + Math.cos(this.arrowDegree)*this.arrowRadius;
    // this.arrow.y = this.y + Math.sin(this.arrowDegree)*this.arrowRadius;

  }

  jump(keys) {

    if (!this.isJumping && this.isGround) {
      this.jumpTimer = 500;
      this.jumpCount++;
    }

    if(this.jumpTimer > 0 
      && !this.isSearch
    ){
      this.body.setVelocityY(-100);
    }

    this.isJumping = true;

  }
  createShot(object){    
    let bullet = new Bullet({
      scene: this.scene,
      x: this.x,
      y: this.y,
      key: "bullet"
    }); 
    this.scene.playerWeaponGroup.add(bullet);
  }
  fromShotPool(){

    if(this.shotTimer > 0){
      return;
    }


    if(!this.isShot){

      this.shotTimer = 300;

      let bullet = this.scene.playerWeaponGroup.getFirst();
      if(!bullet){
        this.createShot();
        
        bullet = this.scene.playerWeaponGroup.get();
      }
      bullet.shot(
        this.status.power,
        this.x + this.width/2,
        this.y,
        this.MOVE_SPEED
      );      
    }

    this.isShot = true;

  }
  tileCollision(){

    this.isGround = true;

    this.jumpCount = 0;  

    this.isSearch = false;

    this.isJumpingReleased = false;

    this.isMove = false;
    this.keyReleaseCount = 0;

    this.body.setVelocity(0,0)

  }
  returnMax1(_x,_y,_max){

    _max = _max ? _max : 1;//初期値の設定

    let arr = {
      x: _x,
      y: _y
    }

    let per = 0;
    let x = arr.x;
    let y = arr.y;
    let x_abs = Math.abs(arr.x);
    let y_abs = Math.abs(arr.y);

    if(x_abs >= y_abs){
      per = y_abs / x_abs;
      x = x >= 0 ? 1 : -1;
      y = y >= 0 ? 1 : -1;
      y = y*per;
    }else{
      per = x_abs / y_abs;
      x = x >= 0 ? 1 : -1;
      y = y >= 0 ? 1 : -1;
      x = x*per;
    }

    arr.x = x * _max;
    arr.y = y * _max;

    return arr;
  }
}
