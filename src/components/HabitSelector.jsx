// src/components/HabitSelector.jsx
import React from "react";

export default function HabitSelector({ habit }) {
  if (!habit) return null;

  const totalBlocks = habit.maxBlocks || 12;
  const earned = habit.blocksEarned || 0;

  // Build an array from top to bottom so the tower grows upward.
  const blocks = Array.from({ length: totalBlocks }, (_, i) => {
    const indexFromBottom = i;
    const levelNumber = totalBlocks - indexFromBottom;
    const isEarned = levelNumber <= earned;
    return { id: levelNumber, isEarned };
  });

  return (
    <div className="tower-wrapper">
      <div className="tower-label-row">
        <span className="tower-title">Habit Tower</span>
        <span className="tower-count">
          {earned}/{totalBlocks} blocks unlocked
        </span>
      </div>
      <div className="tower">
        {blocks
          .slice()
          .reverse()
          .map((b) => (
            <div
              key={b.id}
              className={b.isEarned ? "tower-block earned" : "tower-block"}
            >
              <span className="tower-block-label">
                {b.isEarned ? "✓" : ""}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
