import Explode from './Explode';

export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    /*==============================
    ダメージアニメーション
    ==============================*/       
    this.explodeSprite = new Explode({
      scene: this.scene,
      x: this.x,
      y: this.y
    });
    

    /*==============================
    ダメージ計算
    ==============================*/      
    // this.damage_text = 0;
    this.damageText = this.scene.add.bitmapText(
      this.x,
      this.y,
      'bitmapFont',
      0,
      30
    );

    this.damageText.setVisible(false);    
    config.scene.physics.world.enable(this.damageText);
    config.scene.add.existing(this.damageText);

    this.damageText.depth = 10;

    this.damageText.body.setAllowGravity(false);  

    this.isDamege = false;

  }
  update(keys, time, delta) {
    if(!this.active){
      return;
    } 
    this.explodeSprite.x = this.x;
    this.explodeSprite.y = this.y;
  }

  damage(num){
    if(this.invincible){
      return;
    }
    if(!this.active){
      return;
    }

    if(this.isDamege === true){
      return;
    }

    /*==============================
    コンボ判定
    TODO
    ==============================*/    
    // if(this.type !== "player"){
    //   this.scene.combo.hit();  
    // }
    /*==============================
    ダメージ計算
    ==============================*/            
    let damage = num - this.status.defense;

    if(damage <= 0){
      damage = 1;
    }
    this.status.hp -= damage;


    /*==============================
    ダメージ表示
    ==============================*/       
    this.damageText.text = damage;
    this.damageText.x = this.x - this.body.halfWidth;
    this.damageText.y = this.y - this.height * 1.8;
    this.damageText.setVisible(true);
    
    let setDamageTextY = this.y - this.height * 1.4;

    let damageTween = this.scene.tweens.add({
        targets: this.damageText,
        y: setDamageTextY,
        ease: 'liner',
        duration: 100,
        repeat: 0,
        completeDelay: 400,
        onComplete: function () {
          this.damageText.setVisible(false);
        },
        callbackScope: this
    });
    /*==============================
    HPが0になっていたらreturn
    ==============================*/    
    if(this.status.hp <= 0){
      this.active = false;
      return;
    }

    /*==============================
    ダメージアニメーション
    ==============================*/       
    this.isDamege = true;

    let enemyDamageTween = this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 200,
      loop: 10,
      onComplete: function () {
        this.damageText.setVisible(false);
        this.alpha = 1;
        this.isDamege = false;
      },
      callbackScope: this
    });

  }
  explode(){


    this.explodeSprite.setPlay();
    // this.setVisible(false); 
    // this.setActive(false);
    // this.body.setVelocity(0,0);

    this.destroy();
    

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
