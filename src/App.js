import React, { useState } from 'react';
import { addHabit } from './services/habitService';

function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getDaysBack(n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    arr.push(dt.toISOString().split("T")[0]);
  }
  return arr;
}

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [showContextClues, setShowContextClues] = useState(false);
  const [contextClueInputs, setContextClueInputs] = useState(["", "", ""]);
  const [successPops, setSuccessPops] = useState({});
  const [showCelebration, setShowCelebration] = useState("");
  const [blockShake, setBlockShake] = useState({});
  const [blockFade, setBlockFade] = useState({});
  const [towerShake, setTowerShake] = useState({});

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim() === "") return;
    setShowContextClues(true);
  };

  const handleAddContextClues = (e) => {
    e.preventDefault();
    const cues = contextClueInputs
      .map(str => str.trim())
      .filter(str => str.length > 0)
      .map(cue => ({ cue, done: false }));
    setHabits(prev => addHabit(prev, newHabitName.trim(), cues, []));
    setNewHabitName("");
    setShowContextClues(false);
    setContextClueInputs(["", "", ""]);
  };

  const handleToggleClue = (habitId, clueIndex) => {
    setHabits(prev =>
      prev.map(habit =>
        habit.id !== habitId
          ? habit
          : {
              ...habit,
              contextCues: habit.contextCues.map((clue, idx) =>
                idx !== clueIndex
                  ? clue
                  : { ...clue, done: !clue.done }
              ),
            }
      )
    );
  };

  function addMilestones(blockStates, habitId) {
    const sorted = [...blockStates].sort((a, b) => a.date.localeCompare(b.date));
    let streak = 0;
    let blocks = [];
    for (let i = 0; i < sorted.length; i++) {
      const block = sorted[i];
      let status = block.status;
      if (status === "complete") {
        streak++;
        if (streak % 5 === 0) {
          status = "milestone";
        }
      } else {
        streak = 0;
        if (status === "missed") {
          setBlockShake(s => ({ ...s, [habitId]: true }));
          setTimeout(() => setBlockShake(s => ({ ...s, [habitId]: false })), 750);
        }
      }
      blocks.push({ ...block, status });
    }
    return blocks;
  }

  const getBlockStatesWithMissedLogic = (blockStates, habitId) => {
    if (!blockStates || blockStates.length === 0) return [];
    let streakBroken = 0;
    let updated = [];
    let anyShake = false;
    let anyFade = false;
    let baseBlocks = addMilestones(blockStates, habitId);
    for (let i = 0; i < baseBlocks.length; i++) {
      const curr = baseBlocks[i];
      if (curr.status === "missed") streakBroken++;
      else streakBroken = 0;

      let status = curr.status;
      if (status === "missed") status = streakBroken === 1 ? "cracked"
                              : streakBroken === 2 ? "destroyed"
                              : streakBroken >= 3 ? "collapse" : "missed";
      updated.push({ ...curr, status });
      if (status === "cracked") anyShake = true;
      if (status === "destroyed") anyFade = true;
    }
    if (updated.some(b => b.status === "collapse") && !towerShake[habitId]) {
      setTowerShake(s => ({ ...s, [habitId]: true }));
      setTimeout(() => setTowerShake(s => ({ ...s, [habitId]: false })), 750);
    }
    if (anyShake && !blockShake[habitId]) {
      setBlockShake(s => ({ ...s, [habitId]: true }));
      setTimeout(() => setBlockShake(s => ({ ...s, [habitId]: false })), 750);
    }
    if (anyFade && !blockFade[habitId]) {
      setBlockFade(s => ({ ...s, [habitId]: false }));
      setTimeout(() => setBlockFade(s => ({ ...s, [habitId]: false })), 900);
    }
    return updated;
  };

  const handleSuccessClick = (habit) => {
    const today = getToday();
    const blocks = habit.blockStates || [];
    const hasToday = blocks.some(b => b.date === today);
    if (hasToday) {
      setSuccessPops(prev => ({ ...prev, [habit.id]: true }));
      setTimeout(() => setSuccessPops(prev => ({ ...prev, [habit.id]: false })), 800);
      return;
    }
    setHabits(prev => prev.map(h => h.id !== habit.id ? h : {
      ...h,
      blockStates: [
        ...blocks,
        { date: today, status: "complete" }
      ]
    }));
    setSuccessPops(prev => ({ ...prev, [habit.id]: true }));
    const allDone = habit.contextCues.every(cue => cue.done);
    // FIX: Prevent double popup
    if (allDone && showCelebration !== habit.name) {
      setShowCelebration(habit.name);
      setTimeout(() => setShowCelebration(""), 1800);
    }
    setTimeout(() => setSuccessPops(prev => ({ ...prev, [habit.id]: false })), 800);
  };

  const handleMissedDay = (habit, daysAgo = 0) => {
    const day = getDaysBack(daysAgo + 1).pop();
    setHabits(prev => prev.map(h => h.id !== habit.id ? h : {
      ...h,
      blockStates: [
        ...(h.blockStates || []),
        { date: day, status: "missed" }
      ]
    }));
  };

  const handleSimulateBlocks = (habit, count = 1) => {
    const today = new Date(getToday());
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - i);
      const dateString = dt.toISOString().split("T")[0];
      blocks.push({ date: dateString, status: "complete" });
    }
    setHabits(prev => prev.map(h => h.id !== habit.id ? h : {
      ...h,
      blockStates: [
        ...(h.blockStates || []),
        ...blocks
      ]
    }));
  };

  // NEW: Repair button
  const handleRepairTower = (habit) => {
    setHabits(prev => prev.map(h => h.id !== habit.id ? h : { ...h, blockStates: [] }));
  };

  const HabitTower = ({ habit }) => {
    let blocks = getBlockStatesWithMissedLogic(habit.blockStates || [], habit.id);
    const collapse = blocks.some(b => b.status === "collapse");
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 16,
          animation: collapse && towerShake[habit.id] ? 'towerShake 0.7s linear' : '',
        }}>
        {blocks.map((block, i) => (
          <div
            key={block.date + i}
            className={
              block.status === "cracked" && blockShake[habit.id] ? "blockShake" :
              block.status === "destroyed" && blockFade[habit.id] ? "blockFade" : ""
            }
            style={{
              width: 32,
              height: 32,
              margin: 2,
              borderRadius: 8,
              background: block.status === "complete" ? "#27ae60" :
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
              opacity: block.status === "destroyed" && blockFade[habit.id] ? 0.45 : 1,
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
              {i+1}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const HabitVertical = ({ habit, onToggleClue }) => {
    let blocks = getBlockStatesWithMissedLogic(habit.blockStates || [], habit.id);
    const isCollapsed = blocks.some(b => b.status === "collapse");
    return (
      <div style={{ marginBottom: 80, textAlign: 'center', position: 'relative' }}>
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{habit.name}</div>
        {habit.contextCues.map((context, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 40 }}>
            <div
              style={{
                padding: '14px 0',
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                width: 160,
                margin: '0 auto',
                cursor: 'pointer',
                border: context.done ? '2px solid #27ae60' : '2px solid #bbb',
                transition: 'border 0.2s',
              }}
              onClick={() => onToggleClue(habit.id, i)}
              title="Click to mark complete/incomplete"
            >
              <span style={{
                fontWeight: 600,
                opacity: context.done ? 0.6 : 1,
                textDecoration: context.done ? 'line-through' : 'none',
                color: context.done ? '#27ae60' : '#111'
              }}>
                Context Clue {i + 1}:
              </span> {context.cue}
            </div>
            {i < habit.contextCues.length && (
              <div style={{
                width: 4,
                height: 40,
                background: '#666',
                borderRadius: 2,
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translateX(-50%)',
              }}></div>
            )}
          </div>
        ))}
        <div style={{ position: 'relative', marginBottom: 0 }}>
          <div
            onClick={() => handleSuccessClick(habit)}
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
          <div style={{
            width: 4,
            height: 40,
            background: "#666",
            borderRadius: 2,
            position: "absolute",
            left: "50%",
            top: "-40px",
            transform: "translateX(-50%)",
          }}></div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button style={{
              border: "1px solid #d32f2f", borderRadius: 7, padding: "5px 11px",
              background: "#fff", color: "#d32f2f", fontWeight: 700, cursor: "pointer"
            }}
              onClick={() => handleMissedDay(habit, 0)}
              title="Mark today as missed"
            >Missed Day</button>
            <button style={{
              border: "1px solid #27ae60", borderRadius: 7, padding: "5px 11px",
              background: "#fff", color: "#27ae60", fontWeight: 700, cursor: "pointer"
            }}
              onClick={() => handleSimulateBlocks(habit, 1)}
              title="Add +1 complete block"
            >+1 Day</button>
            <button style={{
              border: "1px solid #222", borderRadius: 7, padding: "5px 11px",
              background: "#eee", color: "#222", fontWeight: 700, cursor: "pointer"
            }}
              onClick={() => handleRepairTower(habit)}
              title="Repair/restart the tower"
            >Repair Tower</button>
          </div>
        </div>
        <HabitTower habit={habit} />
        {showCelebration === habit.name && (
          <div style={{
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
          }}>
            🎉 All context clues completed first!
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', padding: 20 }}>
      <h1>Habit Tracker MVP</h1>
      {!showContextClues ? (
        <form onSubmit={handleAddHabit}>
          <input
            type="text"
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
            placeholder="Enter Habit Name"
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <button type="submit" style={{ width: '100%' }}>
            Add Habit
          </button>
        </form>
      ) : (
        <form onSubmit={handleAddContextClues} style={{ marginTop: 24 }}>
          {[0, 1, 2].map(idx => (
            <input
              key={idx}
              type="text"
              value={contextClueInputs[idx]}
              onChange={e => {
                const updated = [...contextClueInputs];
                updated[idx] = e.target.value;
                setContextClueInputs(updated);
              }}
              placeholder={`Context Clue ${idx + 1}`}
              style={{ width: '100%', marginBottom: 8 }}
              required
            />
          ))}
          <button type="submit" style={{ width: '100%' }}>
            Add Context Clues
          </button>
        </form>
      )}

      <div style={{ marginTop: 32 }}>
        {habits.map((habit, i) => (
          <HabitVertical
            key={habit.id}
            habit={habit}
            onToggleClue={handleToggleClue}
          />
        ))}
      </div>
      <style>{`
        @keyframes popCelebration {
          0% { transform: translateX(-50%) scale(0.85); opacity: 0; }
          70% { transform: translateX(-50%) scale(1.15); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        @keyframes blockShake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
        @keyframes blockFade {
          0% { opacity: 1; }
          49% { opacity: 0.45; }
          100% { opacity: 0.45; }
        }
        @keyframes towerShake {
          0% { transform: translateX(0); }
          12% { transform: translateX(-9px); }
          28% { transform: translateX(8px); }
          44% { transform: translateX(-6px); }
          60% { transform: translateX(7px); }
          100% { transform: translateX(0); }
        }
        .blockShake {
          animation: blockShake 0.7s;
        }
        .blockFade {
          animation: blockFade 0.9s;
        }
      `}</style>
    </div>
  );
}

export default App;
