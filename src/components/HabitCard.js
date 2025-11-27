// src/components/HabitCard.js
import React from 'react';
import HabitTower from './HabitTower';
import ContextCues from './ContextCues';

function HabitCard({
  habit,
  onToggleClue,
  onSuccess,
  onMissed,
  onSimulate,
  onRepair,
  successPops,
  blockShake,
  towerShake,
  showCelebration,
}) {
  return (
    <div style={{ marginBottom: 80, textAlign: 'center', position: 'relative' }}>
      <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
        {habit.name}
      </div>

      <ContextCues habit={habit} onToggleClue={onToggleClue} />

      <HabitTower
        habit={habit}
        shakeTower={towerShake[habit.id]}
        shakeBlocks={blockShake[habit.id]}
      />

      <div style={{ position: 'relative', marginBottom: 0 }}>
        <div
          onClick={() => onSuccess(habit)}
          style={{
            background: successPops[habit.id] ? "#27ae60" : "#fff",
            color: successPops[habit.id] ? "#fff" : "#222",
            border: "2px solid #27ae60",
            borderRadius: 16,
            fontWeight: 'bold',
            fontSize: 16,
            width: 210,
            margin: "0 auto",
            marginTop: -20,
            padding: "22px 0",
            boxShadow: successPops[habit.id] ? "0 0 16px 6px #baffc9" : "0 1px 6px rgba(0,0,0,0.07)",
            cursor: 'pointer',
            transition: 'all 0.2s',
            transform: successPops[habit.id] ? 'scale(1.06)' : 'scale(1.0)',
          }}
          title="Click to mark daily habit completed"
        >
          Success! Daily Habit Completed
          {successPops[habit.id] && (
            <span style={{ fontWeight: 400, display: 'block', fontSize: 13, marginTop: 7 }}>
              Clicked!
            </span>
          )}
        </div>
        <div
          style={{
            width: 4,
            height: 40,
            background: "#666",
            borderRadius: 2,
            position: "absolute",
            left: "50%",
            top: "-40px",
            transform: "translateX(-50%)",
          }}
        ></div>
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <button
            style={{
              border: "1px solid #d32f2f",
              borderRadius: 7,
              padding: "5px 11px",
              background: "#fff",
              color: "#d32f2f",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => onMissed(habit)}
            title="Mark today as missed"
          >
            Missed Day
          </button>
          <button
            style={{
              border: "1px solid #27ae60",
              borderRadius: 7,
              padding: "5px 11px",
              background: "#fff",
              color: "#27ae60",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => onSimulate(habit, 1)}
            title="Add +1 complete block"
          >
            +1 Day
          </button>
          <button
            style={{
              border: "1px solid #222",
              borderRadius: 7,
              padding: "5px 11px",
              background: "#eee",
              color: "#222",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => onRepair(habit)}
            title="Repair/restart the tower"
          >
            Repair Tower
          </button>
        </div>
      </div>

      {showCelebration === habit.name && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "94%",
            transform: "translateX(-50%)",
            background: "#FFD700",
            color: "#222",
            padding: "18px 26px",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.19)",
            animation: "popCelebration 0.7s",
            zIndex: 10,
          }}
        >
          🎉 All context clues completed first!
        </div>
      )}
    </div>
  );
}

export default HabitCard;
