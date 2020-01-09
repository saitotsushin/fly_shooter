import Player from '../sprites/Player';
import Coin from '../sprites/item/Coin';
import ClearGame from '../sprites/ClearGame';

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

    /*==============================
    UI | ゲームクリア
    ==============================*/
    this.clearGameObj = new ClearGame({
      scene: this
    }); 

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.groundLayer = this.map.createDynamicLayer('ground', this.tileset, 0, 0);
    this.groundLayer.setCollisionBetween(0, 100);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    this.itemGroup = this.add.group();

    this.map.getObjectLayer('item').objects.forEach(
      (item) => {
        let itemObject;

        switch (item.name) {
          case 'coin':
            itemObject = new Coin({
                scene: this,
                key: 'coin',
                x: item.x,
                y: item.y
            });
            this.itemGroup.add(itemObject);
            break;
            case 'coin_big':
              itemObject = new Coin({
                  scene: this,
                  key: 'coin_big',
                  x: item.x,
                  y: item.y
              });
              this.itemGroup.add(itemObject);
              break;
            default:
            break;
        }
      }
    );

    this.playerWeaponGroup = this.add.group(
      {
        runChildUpdate: true
      }
    );

    this.player = new Player({
      scene: this,
      key: 'player',
      x: 60,
      y: 100,
    });


    

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

    this.cameras.main.setBackgroundColor('#CCCCCC');
    this.cameras.main.setSize(this.scene.systems.game.config.width,this.scene.systems.game.config.height);
    this.cameras.main.startFollow(this.player,false,1,0,-40,0);
    this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);

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
    this.player.update(this.keys, time, delta);

  }
  titleGame(){
    this.scene.start('TitleScene');
  }
  refleshGame(){
    this.scene.start('GameScene');
  }
}

export default GameScene;
