class TitleScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'TitleScene'
      });
  }
  preload() {
      // this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');
  }
  create() {
      let config = {
          key: 'title',
          frames: [{
              frame: 'title',
          }]
      };

      
      this.title = this.physics.add.sprite(160, 100, 'title');
      
      this.title_start = this.physics.add.sprite(160, 300, 'title_start').setScrollFactor(0, 0).setInteractive();;

      this.title_start.on('pointerdown', () => {
          this.startGame();
      });
  }



  startGame() {
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
  }

  // restartScene() {
  //     //        this.attractMode.stop();
  //     this.scene.stop('GameScene');
  //     this.scene.launch('GameScene');
  //     this.scene.bringToTop();

  //     this.registry.set('restartScene', false);
  // }
}

export default TitleScene;
