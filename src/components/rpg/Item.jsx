import React from 'react';

const Item = {
  render: (ctx, item) => {
    const itemSize = 16;
    const itemHalfSize = itemSize / 2;
    ctx.fillStyle = item.type === 'potion' ? '#ff4444' :
                   item.type === 'sword' ? '#cccccc' : '#ffdd44';
    ctx.fillRect(item.x - itemHalfSize, item.y - itemHalfSize, itemSize, itemSize);
    
    const sparkleSize = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(item.x - sparkleSize / 2, item.y - sparkleSize / 2, sparkleSize, sparkleSize);
  }
};

export default Item;