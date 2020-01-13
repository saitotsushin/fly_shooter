class BootScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BootScene'
    });
  }
  preload() {
    this.make.text({
      x: this.sys.game.config.width/2,
      y: 100,
      text: 'LOADING...',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
      }
    });
    let progressNumb = this.make.text({
      x: this.sys.game.config.width/2,
      y: 120,
      text: '',
      origin: { x: 0.5, y: 0.5 },
      style: {
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
      }
    });
    this.progress = this.add.graphics();

    this.load.on('progress', (value) => {
      this.progress.clear();
      this.progress.fillStyle(0xffffff, 1);
      progressNumb.text = Math.round(value*100) + "%";
    });

    this.load.on('complete', () => {
      this.progress.destroy();
      this.scene.start('GameScene');
    });


    //start loading
    this.load.pack('Preload', 'assets/pack.json', 'Preload');

    // this.load.image('tiles', 'assets/tilemaps/tile.png');
    // this.load.tilemapTiledJSON('map', 'assets/tilemaps/tilemap.json');

    this.load.spritesheet('player', 'assets/images/player.png', { frameWidth: 18, frameHeight: 30 });    
    this.load.image('bullet', 'assets/images/bullet.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('coin_big', 'assets/images/coin_big.png');
    this.load.image('button_continue', 'assets/images/button_continue.png');
    this.load.spritesheet('explosion_m', 'assets/images/explosion_m.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('bad', 'assets/images/bad.png', { frameWidth: 10, frameHeight: 10 });    
    this.load.image('brain', 'assets/images/brain.png');
    this.load.bitmapFont('bitmapFont', 'assets/font/font.png', 'assets/font/font.xml');
    this.load.bitmapFont('bitmapFontYellow', 'assets/font/font_yellow.png', 'assets/font/font.xml');
  }

}

export default BootScene;
