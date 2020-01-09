

export default class ClearGame extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {

    super(config.scene);

    this.visible = false;

    this.container = this.scene.add.container(0, 0);
    this.container.depth = 100;
    this.container.setScrollFactor(0);

    this.overlapArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );    
    this.rect = new Phaser.Geom.Rectangle(0, 0, config.scene.game.config.width, config.scene.game.config.height);
    this.overlapArea.fillRectShape(this.rect);
    this.overlapArea.alpha = 0.15;
    this.overlapArea.setScrollFactor(0);

    this.scoreTxt = this.scene.add.text(config.scene.game.config.width/2, 140, '', { font: '10px Courier', fill: '#FFFFFF' });

    this.scoreTxt.setOrigin(0.5,0.5);
    this.scoreTxt.setScrollFactor(0);

    this.buttonTitle = config.scene.add.sprite(
      config.scene.game.config.width/2,
      200,
      'button_continue'
    );
    // this.buttonTitle.setAllowGravity(true);  
    this.buttonTitle.setScrollFactor(0);
    this.buttonTitle.setOrigin(0.5,0.5);
    this.buttonTitle.setInteractive();
    // config.scene.physics.world.enable(this.buttonTitle);
    // config.scene.add.existing(this.buttonTitle);    

    this.container.add([
      this.overlapArea,
      this.scoreTxt,
      this.buttonTitle
    ]);
    
    this.container.visible = false;

    this.buttonTitle.on('pointerdown', () => {
      // this.scene.titleGame();
      this.scene.refleshGame();
    });    


  }
  open(){
    this.container.visible = true;
    this.scoreTxt.setText(
      [
        'COIN   :'+this.scene.registry.list.coin
      ]
    );
  }
}
