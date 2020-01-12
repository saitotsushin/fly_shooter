export default class Animations{
  constructor(config) {

    config.scene.anims.create({
      key: 'explosionAnime_m',
      frames: config.scene.anims.generateFrameNumbers('explosion_m', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0,
      hideOnComplete: true
    });
    config.scene.anims.create({
      key: 'badAnime',
      frames: config.scene.anims.generateFrameNumbers('bad', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });      

  }
}
