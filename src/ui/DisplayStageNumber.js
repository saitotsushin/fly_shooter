
export default class DisplayStageNumber extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {

    super(config.scene);


    let stageNumber = config.scene.stageNumber;
    stageNumber = String(stageNumber);
    if(stageNumber === "1"){
      stageNumber = '1st';
    }
    if(stageNumber === "2"){
      stageNumber = '2nd';
    }
    if(stageNumber === "3"){
      stageNumber = '3rd';
    }
    if(stageNumber === "4"){
      stageNumber = '4th';
    }
    if(stageNumber === "5"){
      stageNumber = 'LAST';
    }

    this.stageNowText = this.scene.add.bitmapText(
      config.scene.game.config.width/2 - 20,
      100,
      'bitmapFont',
      stageNumber+' STAGE',
      24
    );
    this.stageNowText.alpha = 0;

    this.depth = 100;
    this.stageNowText.setScrollFactor(0);
    this.stageNowText.setOrigin(0.5,0.5);
    var stageNumberTween = this.scene.tweens.timeline({
      targets: this.stageNowText,
      ease: 'liner',
      duration: 100,
      tweens:[{
        x: config.scene.game.config.width/2,
        alpha: 1,
        duration: 300
      },{
        duration: 1000
      },{
        x: config.scene.game.config.width/2 + 20,
        alpha: 0,
        duration: 300
      }
      ],
      delay: 500,
      repeat: 0,
      completeDelay: 400,
      callbackScope: this,
      onComplete: function () {
        this.scene.stageActive = true;
        this.stageNowText.setActive(false);
        this.stageNowText.setVisible(false);
      }
    });
  }

}
