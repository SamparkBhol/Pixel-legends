import React from 'react';

const Enemy = {
  render: (ctx, enemy) => {
    const enemySize = 20;
    const enemyHalfSize = enemySize / 2;
    ctx.fillStyle = enemy.type === 'goblin' ? '#44ff44' : '#ff8844'; 
    ctx.fillRect(enemy.x - enemyHalfSize, enemy.y - enemyHalfSize, enemySize, enemySize);
    
    const healthBarWidth = 24;
    const healthBarHeight = 4;
    const healthBarYOffset = enemyHalfSize + 8;

    const healthPercent = enemy.health / enemy.maxHealth;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - healthBarYOffset, healthBarWidth, healthBarHeight);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - healthBarYOffset, healthBarWidth * healthPercent, healthBarHeight);
  }
};

export default Enemy;