export default class CollisionCheck{
  constructor(config) {

    config.scene.physics.add.collider(config.scene.enemyGroup,config.scene.groundLayer);

    config.scene.physics.add.overlap(config.scene.player,config.scene.enemyGroup,
      function(player,enemy){
        if(!enemy.active){
          return;
        }
        
        player.damage(enemy.status.power);

        if(player.status.hp <= 0){
          player.explode();
        }
      }
    );

  }

}
