import React from 'react';

// mark every 5th consecutive complete as milestone
function addMilestones(blockStates) {
  const sorted = [...blockStates].sort((a, b) => a.date.localeCompare(b.date));
  let streak = 0;
  return sorted.map(block => {
    let status = block.status;
    if (status === "complete") {
      streak++;
      if (streak % 5 === 0) status = "milestone";
    } else {
      streak = 0;
    }
    return { ...block, status };
  });
}

// add crack/destroy/collapse based on missed
function addMissedLogic(blockStates) {
  let streakBroken = 0;
  return blockStates.map(block => {
    let status = block.status;
    if (status === "missed") {
      streakBroken++;
      status =
        streakBroken === 1 ? "cracked" :
        streakBroken === 2 ? "destroyed" :
        streakBroken >= 3 ? "collapse" :
        "missed";
    } else {
      streakBroken = 0;
    }
    return { ...block, status };
  });
}

function HabitTower({ habit, shakeTower, shakeBlocks }) {
  const baseBlocks = habit.blockStates || [];
  let blocks = addMissedLogic(addMilestones(baseBlocks));
  const collapse = blocks.some(b => b.status === "collapse");

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        animation: collapse && shakeTower ? 'towerShake 0.7s linear' : '',
      }}
    >
      {blocks.map((block, i) => (
        <div
          key={block.date + i}
          className={
            block.status === "cracked" && shakeBlocks ? "blockShake" :
            block.status === "destroyed" ? "blockFade" : ""
          }
          style={{
            width: 32,
            height: 32,
            margin: 2,
            borderRadius: 8,
            background:
              block.status === "complete" ? "#27ae60" :
              block.status === "milestone" ? "gold" :
              block.status === "cracked" ? "#FFD700" :
              block.status === "destroyed" ? "#d32f2f" :
              block.status === "collapse" ? "#bbb" : "#eee",
            border: block.status === "milestone"
              ? "3px solid orange"
              : "2px solid #222",
            display: "inline-block",
            boxShadow: block.status === "milestone"
              ? "0 0 20px 4px gold"
              : block.status === "complete"
                ? "0 2px 14px #baffc9"
                : "none",
            position: "relative",
            opacity: block.status === "destroyed" ? 0.45 : 1,
            filter: block.status === "collapse" ? "blur(0.5px)" : "none",
            transition: "opacity 0.7s"
          }}
          title={block.status}
        >
          {block.status === "milestone" && (
            <span style={{
              color: "orange",
              fontWeight: 700,
              fontSize: 22,
              position: "absolute",
              left: 7,
              top: 3,
            }}>★</span>
          )}
          <span style={{
            color: "#fff",
            fontWeight: 700,
            position: "absolute",
            left: block.status === "milestone" ? 14 : 8,
            top: 8,
            fontSize: 13,
            opacity: 0.8
          }}>
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

export default HabitTower;
