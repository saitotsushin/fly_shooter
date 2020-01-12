import Brain from '../sprites/character/enemy/Brain';
import Bad from '../sprites/character/enemy/Bad';

import Coin from '../sprites/item//Coin';

export default class ParseObjectLayers {
  constructor(config) {
    this.scene = config.scene;

    this.addObject();

  }
  addObject() {
    
    this.scene.map.getObjectLayer('item').objects.forEach(
      (item) => {
        let itemObject;
        
        switch (item.name) {
          case 'coin':
            itemObject = new Coin({
                scene: this.scene,
                key: 'coin',
                x: item.x,
                y: item.y
            });
            this.scene.itemGroup.add(itemObject);
            break;
          case 'coin_big':
            itemObject = new Coin({
                scene: this.scene,
                key: 'coin_big',
                x: item.x,
                y: item.y
            });
            this.scene.itemGroup.add(itemObject);
            break;
          default:
            break;
        }
      }
    );
    this.scene.map.getObjectLayer('enemy').objects.forEach(
      (enemy) => {
        let enemyObject;


        switch (enemy.name) {
          case 'brain':
            enemyObject = new Brain({
                scene: this.scene,
                key: 'brain',
                x: enemy.x,
                y: enemy.y
            });
            this.scene.enemyGroup.add(enemyObject);
            break;                      
          case 'bad':
            enemyObject = new Bad({
                scene: this.scene,
                key: 'bad',
                x: enemy.x,
                y: enemy.y
            });
            this.scene.enemyGroup.add(enemyObject);
            break;
  
          default:
            break;
        }
      }
    );
  }

}
