import Player from '../sprites/character/Player';
import ClearGame from '../sprites/ClearGame';
import CollisionCheck from '../helper/CollisionCheck';
import ParseObjectLayers from '../helper/ParseObjectLayers';
import Animations from '../helper/Animations';
import DisplayStageNumber from '../ui/DisplayStageNumber';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){
    
    this.registry.set('coin', 0);    

    this.coinCounter = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.coinCounter.depth = 100;
    this.coinCounter.setScrollFactor(0,0);

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.groundLayer = this.map.createDynamicLayer('ground', this.tileset, 0, 0);
    this.groundLayer.setCollisionBetween(0, 100);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    /*==============================
    UI | ゲームクリア
    ==============================*/
    this.clearGameObj = new ClearGame({
      scene: this
    }); 
    /*==============================
    UI | ステージ数の表示
    ==============================*/
    this.registry.set('stage', "1");
    this.stageNumber = this.registry.list.stage;

    this.displayStageNumber = new DisplayStageNumber({
      scene: this
    });
    this.stageActive = false;

    /*==============================
    アニメーションの読み込み
    ==============================*/
    this.animations;
    if(!this.animations){
      this.animations = new Animations({
        scene: this
      });

    }
   
    /*==============================
    GROUP管理
    ==============================*/    
    this.enemyGroup = this.add.group(); 
    this.itemGroup = this.add.group();  

    this.objectLayers = new ParseObjectLayers({
      scene: this
    });

    /*==============================
    プレイヤー生成
    ==============================*/      
    this.playerWeaponGroup = this.add.group(
      {
        runChildUpdate: true
      }
    );

    this.player = new Player({
      scene: this,
      key: 'player',
      x: 60,
      y: this.map.heightInPixels - 200,
    });

    /*==============================
    入力
    ==============================*/    
    this.keys = {
      isTOUCH: false,
      DIRECTION: 0,
      LEFT: false,
      RIGHT: false,
      isRELEASE: false
    };

    this.input.on('pointerdown', function (pointer) {
      this.keys.isTOUCH = true;
      this.keys.isRELEASE = false;
      if(pointer.x > this.game.config.width / 2){
        this.keys.LEFT = false;
        this.keys.RIGHT = true;
      }else{
        this.keys.LEFT = true;
        this.keys.RIGHT = false;
      }
    }, this);

    this.input.on('pointerup', function (pointer) {
      this.keys.isTOUCH = false;
      this.keys.isRELEASE = true;
      this.keys.LEFT = false;
      this.keys.RIGHT = false;
    }, this);

    /*==============================
    カメラ
    ==============================*/      
    this.cameras.main.setBackgroundColor('#CCCCCC');
    this.cameras.main.setSize(this.scene.systems.game.config.width,this.scene.systems.game.config.height);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
    this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);

    /*==============================
    衝突判定
    ==============================*/
    this.CollisionCheck = new CollisionCheck({
      scene: this
    });   
    this.physics.add.overlap(this.player,this.itemGroup,function(player,item){
      item.hit();
    });

  }

  update(time, delta) {

    this.coinCounter.setText(
      [
        'COIN :'+this.registry.list.coin
      ]
    );

    if(!this.stageActive){
      return;
    }else{
      this.player.alive();
    }
    this.player.update(this.keys, time, delta);
    this.enemyGroup.children.entries.forEach(
      (sprite) => {

        if(
          sprite.x < this.cameras.main.scrollX + this.cameras.main.width
          && this.cameras.main.scrollX < sprite.x
          && sprite.y < this.cameras.main.scrollY + this.cameras.main.height
          && this.cameras.main.scrollY < sprite.y
          && sprite.status.hp > 0
        ){
          sprite.active = true;
          sprite.update(time, delta);
        }else{
          sprite.active = false;
        }
      }
    );

  }
  titleGame(){
    this.scene.start('TitleScene');
  }
  refleshGame(){
    this.scene.start('GameScene');
  }
}

export default GameScene;
