import React from 'react';

const NPC = {
  render: (ctx, npc) => {
    const npcSize = 20;
    const npcHalfSize = npcSize / 2;
    ctx.fillStyle = '#4444ff'; 
    ctx.fillRect(npc.x - npcHalfSize, npc.y - npcHalfSize, npcSize, npcSize);
    
    ctx.fillStyle = '#ffffff';
    const eyeSize = 3;
    const eyeOffsetX = 6;
    const eyeOffsetY = 6;
    const mouthWidth = 6;
    const mouthHeight = 2;

    ctx.fillRect(npc.x - eyeOffsetX + eyeSize / 2, npc.y - eyeOffsetY + eyeSize/2, eyeSize, eyeSize);
    ctx.fillRect(npc.x + eyeOffsetX - eyeSize * 1.5, npc.y - eyeOffsetY + eyeSize/2, eyeSize, eyeSize);
    ctx.fillRect(npc.x - mouthWidth / 2, npc.y, mouthWidth, mouthHeight);
  }
};

export default NPC;