import React from 'react';

const Player = {
  render: (ctx, player) => {
    ctx.fillStyle = '#22c55e';
    const playerSize = 20; 
    const playerHalfSize = playerSize / 2;

    ctx.fillRect(player.x - playerHalfSize, player.y - playerHalfSize, playerSize, playerSize);
    
    ctx.fillStyle = '#ffffff';
    const indicatorSize = 4;
    const indicatorOffset = 8;
    switch (player.direction) {
      case 'up':
        ctx.fillRect(player.x - indicatorSize / 2, player.y - indicatorOffset, indicatorSize, indicatorSize);
        break;
      case 'down':
        ctx.fillRect(player.x - indicatorSize / 2, player.y + indicatorOffset - indicatorSize, indicatorSize, indicatorSize);
        break;
      case 'left':
        ctx.fillRect(player.x - indicatorOffset, player.y - indicatorSize / 2, indicatorSize, indicatorSize);
        break;
      case 'right':
        ctx.fillRect(player.x + indicatorOffset - indicatorSize, player.y - indicatorSize / 2, indicatorSize, indicatorSize);
        break;
      default:
        break;
    }

    const healthBarWidth = 24;
    const healthBarHeight = 4;
    const healthBarYOffset = playerHalfSize + 4; 

    const playerHealthPercent = player.health / player.maxHealth;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(player.x - healthBarWidth / 2, player.y - healthBarYOffset, healthBarWidth, healthBarHeight);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x - healthBarWidth / 2, player.y - healthBarYOffset, healthBarWidth * playerHealthPercent, healthBarHeight);
  }
};

export default Player;