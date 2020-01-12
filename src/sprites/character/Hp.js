export default class Hp {
  constructor(config) {

    this.taget = config.target;
    this._scene = config.scene;

    this.hp = config.hp;
    this.hpMax = config.hp;
    this.active = false;


    this.hp_bar = config.scene.add.sprite(0, 0, 'hp_bar_s');
    this.hp_bar.displayWidth = this.taget.body.width;
    this.hp_bar.displayWidthMax = this.taget.body.width;
    this.hp_bar.displayOriginX = 0;
    this.hp_bar.displayOriginY = 0;
    this.hp_bar.x = this.taget.x - this.taget.body.halfWidth;
    this.hp_bar.y = this.taget.y - this.taget.body.halfHeight - this.hp_bar.height * 1.5;
    this.hp_bar.depth = 10;

    this.hp_bar_bg = config.scene.add.sprite(0, 0, 'hp_bar_s');
    this.hp_bar_bg.displayWidth = this.taget.body.width;
    this.hp_bar_bg.displayWidthMax = this.taget.body.width;
    this.hp_bar_bg.displayOriginX = 0;
    this.hp_bar_bg.displayOriginY = 0;
    this.hp_bar_bg.alpha = 0.4;    
    this.hp_bar_bg.x = this.taget.x - this.taget.body.halfWidth;
    this.hp_bar_bg.y = this.taget.y - this.taget.body.halfHeight - this.hp_bar_bg.height * 1.5;
    this.hp_bar_bg.depth = 10;
  }
  move(x,y){
    this.hp_bar.x = x - this.taget.body.halfWidth;
    this.hp_bar.y = y - this.taget.body.halfHeight - this.hp_bar.height * 1.5;
    this.hp_bar_bg.x = x - this.taget.body.halfWidth;
    this.hp_bar_bg.y = y - this.taget.body.halfHeight - this.hp_bar_bg.height * 1.5;
  }
  calc(num,obj){
    
    if(this.active === false){
      return;
    }
    if(this.hp > this.hpMax){
      this.hp = this.hpMax;
      return;
    }
    this.hp = this.hp + num;
    obj.status.hp = this.hp;
    this.hp_bar.displayWidth = this.hp_bar.displayWidthMax * (this.hp / this.hpMax);
    if(this.hp <= 0){
      this._scene.combo_count++;
      if(this._scene.combo_count >= 2){
        this._scene.comboText.text = this._scene.combo_count;        
      }
      this.active = false;
      obj.active = false;
    }
    

  }
  explode(){
    this.hp_bar.destroy();
    this.hp_bar_bg.destroy();
  }
}
