import Character from './Character';


export default class Enemy extends Character {

  constructor(config) {

    super(config);
    this._scene = config.scene;
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.setImmovable(true);/*ぶつかっても影響を受けない*/

    this.active = false;

    this.isTargeted = false;
    this.targetedDelayTimer = 0;
    this.targetedDelayTimerMax = 300;

  }


}