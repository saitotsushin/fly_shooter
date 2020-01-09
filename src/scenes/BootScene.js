class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    });
  }
  preload() {
    const progress = this.add.graphics();

    this.load.on('progress', (value) => {
        progress.clear();
        progress.fillStyle(0xffffff, 1);
        progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
    });

    this.load.on('complete', () => {
        progress.destroy();
        this.scene.start('GameScene');
    });



    this.load.image('tiles', 'assets/tilemaps/tile.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/tilemap.json');

    //spritesheetは画像のサイズを合わせないとframe errorになる...
    this.load.spritesheet('player', 'assets/images/player.png', { frameWidth: 18, frameHeight: 30 });    
    this.load.image('bullet', 'assets/images/bullet.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('coin_big', 'assets/images/coin_big.png');
    this.load.image('button_continue', 'assets/images/button_continue.png');
  }
}

export default BootScene;
