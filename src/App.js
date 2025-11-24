import React, { useState } from 'react';
import { addHabit } from './services/habitService';

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [showContextClues, setShowContextClues] = useState(false);
  const [contextClueInputs, setContextClueInputs] = useState(["", "", ""]);
  // Local success pop state per habit
  const [successPops, setSuccessPops] = useState({}); // {habitId: true|false}
  const [showCelebration, setShowCelebration] = useState(""); // empty or habit name

  // Step 1: Handle input for habit name and transition to context clue inputs
  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabitName.trim() === "") return;
    setShowContextClues(true);
  };

  // Step 2: Add context clues and finalize habit in the list
  const handleAddContextClues = (e) => {
    e.preventDefault();
    const cues = contextClueInputs
      .map(str => str.trim())
      .filter(str => str.length > 0)
      .map(cue => ({ cue, done: false }));
    setHabits(prev => addHabit(prev, newHabitName.trim(), cues));
    setNewHabitName("");
    setShowContextClues(false);
    setContextClueInputs(["", "", ""]);
  };

  // Handler for toggling context clue completion
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

  // Handler for clicking the big "Success" block
  const handleSuccessClick = (habit) => {
    setSuccessPops(prev => ({ ...prev, [habit.id]: true }));
    // If all context clues are done, show extra celebration
    const allDone = habit.contextCues.every(cue => cue.done);
    if (allDone) {
      setShowCelebration(habit.name);
      setTimeout(() => setShowCelebration(""), 1800);
    }
    // Animate block pop back down
    setTimeout(() => setSuccessPops(prev => ({ ...prev, [habit.id]: false })), 800);
  };

  // Vertical habit display with chained clues and toggling
  const HabitVertical = ({ habit }) => (
    <div style={{ marginBottom: 60, textAlign: 'center', position: 'relative' }}>
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
            onClick={() => handleToggleClue(habit.id, i)}
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
          {/* Render connector unless it's the last context clue */}
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
      {/* Big Success Box */}
      <div style={{ position: 'relative', marginBottom: 50 }}>
        <div
          onClick={() => handleSuccessClick(habit)}
          style={{
            background: successPops[habit.id] ? '#27ae60' : '#fff',
            color: successPops[habit.id] ? '#fff' : '#222',
            border: '2px solid #27ae60',
            borderRadius: 16,
            fontWeight: 'bold',
            fontSize: 16,
            width: 210,
            margin: '0 auto',
            marginTop: -20,
            padding: '22px 0',
            boxShadow: successPops[habit.id]
              ? '0 0 16px 6px #baffc9'
              : '0 1px 6px rgba(0,0,0,0.07)',
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
        {/* Chain connector below last clue */}
        <div style={{
          width: 4,
          height: 40,
          background: '#666',
          borderRadius: 2,
          position: 'absolute',
          left: '50%',
          top: '-40px',
          transform: 'translateX(-50%)',
        }}></div>
      </div>
      {/* Celebration Popup */}
      {showCelebration === habit.name && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '90%',
          transform: 'translateX(-50%)',
          background: '#FFD700',
          color: '#222',
          padding: '18px 26px',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.19)',
          animation: 'popCelebration 0.7s',
          zIndex: 10,
        }}>
          🎉 All context clues completed first!  
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 320, margin: '0 auto', padding: 20 }}>
      <h1>Habit Tracker MVP</h1>
      {/* Input for new habit */}
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
        // Step for context clues
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
          />
        ))}
      </div>
      {/* Celebration keyframes */}
      <style>{`
        @keyframes popCelebration {
          0% { transform: translateX(-50%) scale(0.85); opacity: 0; }
          70% { transform: translateX(-50%) scale(1.15); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
