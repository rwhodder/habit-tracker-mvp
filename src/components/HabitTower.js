// src/components/HabitTower.js
import React from 'react';

// Utility: Get a pyramid layout (blocks per row)
function getPyramidRows(totalBlocks) {
  let rows = [];
  let remaining = totalBlocks;
  for (let row = 1; remaining > 0; row++) {
    const rowBlocks = Math.min(row, remaining);
    rows.unshift(rowBlocks); // pyramid: biggest rows at bottom
    remaining -= rowBlocks;
  }
  return rows;
}

function HabitTower({ habit }) {
  // For demo: show up to 15 blocks (show habit.days.length/blockStates.length for real data)
  const blockCount = habit.blockStates ? habit.blockStates.length : 10;
  const rows = getPyramidRows(blockCount);

  let blockIndex = 0;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0'}}>
      {rows.map((blocks, i) => (
        <div key={i} style={{display: 'flex', justifyContent: 'center', marginBottom: 2}}>
          {Array.from({ length: blocks }).map((_, j) => {
            // Style blocks based on status if you wish (blockStates)
            const block = habit.blockStates?.[blockIndex];
            blockIndex++;
            return (
              <div
                key={j}
                style={{
                  width: 28, height: 28,
                  margin: 2,
                  background: block?.status === 'complete' ? '#FFD700' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  boxShadow: block?.status === 'complete' ? '0 0 6px #FFD700' : 'none',
                }}
                title={block ? block.status : 'empty'}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default HabitTower;
