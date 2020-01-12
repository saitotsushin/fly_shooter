import Character from './Character';
import Bullet from './Bullet';

export default class Player extends Character{
  constructor(config) {
    super(config);

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

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.status = {
      hp: 10,
      power: 10,
      defense: 1,
      shotSpeed: 100
    };
    /*==============================
    初期設定
    ==============================*/
    this.body.setVelocity(0,0);
    this.body.setAllowGravity(false);
    this.setVisible(false);
    this.setActive(false);
 
    this.weaponMoveSpeed = 0.15;

    this.jumpTimer = 0;
    this.jumpCount = 0;
    this.jumpCountMax = 2;
    this.isJumping = false;
    this.isGround = false;

    this.MOVE_SPEED = 80;  
    
    this.ADD_MOVE_VECTOR = 120;   

    this.isSearch = false;

    this.isJumpingReleased = false;


    this.arrowDegree = 0;
    this.arrowDegreeBase = 90;
    this.searchZoneWidth = 10;
    this.searchLevel = 8;
    this.arrowRadius = this.searchLevel * this.searchZoneWidth;


    this.weapon = this.scene.add.sprite(this.x, this.y, 'bullet');
    this.weapon.setActive(false);
    this.weapon.setVisible(false);
    this.weaponDegree = 0;
    this.weaponDegreeBase = 180;
    this.weaponRadius = 30; 
    this.weaponDegreeDirection = '';   
    config.scene.physics.world.enable(this.weapon);
    config.scene.add.existing(this.weapon);

    this.weapon.body.setAllowGravity(false);  

    this.moveVelocity = {
      x: 0,
      y: 0
    };

    this.isMove = false;

    this.keyReleaseCount = 0;

    /*==============================
    方向の表示
    ==============================*/       
    this.arrow_line = this.scene.add.graphics({ lineStyle: { width: 1, color: 0xFF0000 } });
    this.arrow_line.lineStyle(2, 0xFFFFFF);
    this.arrow_line_pos = {
      x: 0,
      y: 0
    }
    this.sencerMoveSpeed = 0.15;

    this.sencerGroup = this.scene.add.group(); 

    for(let i = 0; i< this.searchLevel ; i++){
      let target_zone = this.scene.add.zone(this.x, this.y).setSize(this.searchZoneWidth, this.searchZoneWidth);
      target_zone.setOrigin(0.5,0.5);
      target_zone.setCircleDropZone(20);
      config.scene.physics.world.enable(target_zone);
      target_zone.body.setAllowGravity(false);
      target_zone.body.debugBodyColor = 0x00ffff;

      this.sencerGroup.add(target_zone);
  
    }
    this.direction = {
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

    /*==============================
    デバッグ START
    ------------------------------*/    
    // this.debugText.setText(
    //   [
    //     'isZoneLeft :'+this.scene.brain.isZoneLeft,
    //   ]
    // );

    /*------------------------------
    デバッグ END
    ==============================*/

    /*==============================
    状態の表示
    ==============================*/    
    this.anims.play("wait", true);
    this.explodeSprite.x = this.x;
    this.explodeSprite.y = this.y;
    this.damageText.x = this.x - this.body.halfWidth;
    if(!this.isDamegeAnimation){
      this.damageText.y = this.y - this.height;
    }

    /*==============================
    プレイヤーに追従するweaponの衝突判定（今は非表示）
    #TODO
    採用するか考える。パワーアップとして採用する？
    ==============================*/       
    this.scene.physics.overlap(this.weapon,this.scene.enemyGroup,
      function(weapon,enemy){
        if(!enemy.active){
          return;
        }
        enemy.damage(this.status.power);

        if(enemy.status.hp <= 0){
          enemy.explode();
        }
    },null,this);


    
    /*==============================
    画面端までの制限
    ==============================*/
    if(this.x <= this.width*0.5
      || this.scene.map.widthInPixels <= (this.x + this.width*0.5)){
      this.body.setVelocityX(0);
      // return;
    }
    if(this.y <= this.height*0.5){
      this.body.setVelocityY(0);
      // return;
    }

    /*==============================
    入力判定
    ==============================*/
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

    /*==============================
    地面判定
    ==============================*/
    if(this.isGround){
      this.weapon.setVisible(false);
      this.weapon.setActive(false);
      this.weaponDegree = this.weaponDegreeBase;
    }else{
      this.attack();
    }
    this.isGround = false;

    /*==============================
    ジャンプ判定
    ==============================*/    
    if(this.jumpTimer > 0 && !this.isSearch){
      this.jumpTimer -= delta;
    }

    /*==============================
    攻撃の判定
    ==============================*/    
    this.scene.physics.overlap(this.sencerGroup,this.scene.enemyGroup,
      function(zone,enemy){
        if(!enemy.active){
          return;
        }
        if(enemy.isTargeted){
          return;
        }

        enemy.isTargeted = true;
        enemy.targetedDelayTimer = enemy.targetedDelayTimerMax;

        let playerPoint = this.getCenter();
        let enemyPoint = enemy.getCenter();
        let { x,y } = enemyPoint.subtract(playerPoint);
        let moveVelocity = this.returnMax1(
          x,
          y
        );

        let radian = Math.atan2(moveVelocity.x, moveVelocity.y);
        let direction_x = Math.sin(radian);
        let direction_y = Math.cos(radian);
    
        let bullet = {
          vx: direction_x,
          vy: direction_y
        }
        this.fromShotPool(bullet);

    },null,this);

    this.sencerGroup.children.entries.forEach(
      (zone,index) => {
        if(this.isSearch && !this.isMove){
          let setIndex = index + 2;
          zone.x = this.x + Math.cos(this.arrowDegree)*zone.width*setIndex;
          zone.y = this.y + Math.sin(this.arrowDegree)*zone.width*setIndex;
        }else{
          zone.x = this.x;
          zone.y = this.y;
        }
      }
    );

    /*==============================
    SHOT攻撃の判定
    ==============================*/ 
    this.scene.physics.add.overlap(this.scene.playerWeaponGroup,this.scene.enemyGroup,
      function(player,enemy){
        if(!enemy.active){
          return;
        }
        
        enemy.damage(this.status.power);

        if(enemy.status.hp <= 0){
          enemy.explode();
        }
      },null,this
    );
  }
  attack(){
    console.log("attack()")
    if(!this.weaponDegreeDirection){
      return;
    }
    if(this.weaponDegreeDirection === 'left'){
      this.weaponDegree += this.weaponMoveSpeed;
    }
    if(this.weaponDegreeDirection === 'right'){
      this.weaponDegree -= this.weaponMoveSpeed;
    }
    /*==============================
    プレイヤーに追従するweapon（今は非表示）
    #TODO
    採用するか考える。パワーアップとして採用する？
    ==============================*/    
    // this.weapon.setVisible(true);
    // this.weapon.setActive(true);
    // this.weapon.x = this.x + Math.cos(this.weaponDegree)*this.weaponRadius;
    // this.weapon.y = this.y + Math.sin(this.weaponDegree)*this.weaponRadius;

  }
  move(){
    if(!this.isMove){
      this.moveVelocity = this.returnMax1(
        this.arrow_line_pos.x - this.x,
        this.arrow_line_pos.y - this.y
      )
      if(this.moveVelocity.y < 0){
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
      this.arrowDegree += this.sencerMoveSpeed;
    }
    if(keys.RIGHT){
      this.arrowDegree -= this.sencerMoveSpeed;
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
  fromShotPool(object){

    let bullet = this.scene.playerWeaponGroup.getFirst();
    if(!bullet){
      this.createShot();
      
      bullet = this.scene.playerWeaponGroup.get();
    }
    bullet.vx = object.vx;
    bullet.vy = object.vy;

    bullet.shot(
      this.status.power,
      this.x + this.width/2,
      this.y,
      bullet.vx,
      bullet.vy,
      this.status.shotSpeed
    );
    
    // this.isShot = true;

  }
  tileCollision(){

    // if(this.body.touching.down){
      this.isGround = true;
      this.jumpCount = 0;  
      this.isSearch = false;

      this.isJumpingReleased = false;
  
      this.isMove = false;
      this.keyReleaseCount = 0;
  
  
    // }
    this.body.setVelocity(0,0);
  }
  alive(){
    if(!this.active){
      this.body.setAllowGravity(true);
      this.setVisible(true);
      this.setActive(true);
    }
  }

}
