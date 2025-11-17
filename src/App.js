import React, { useState } from 'react';
import LogButton from './components/LogButton';
import HabitSelector from './components/HabitSelector';

// === Castle layout grid setup ===
const castleGrid = [
  [false, false, false, true, true, false, false, false],
  [false, false, false, true, true, false, false, false],
  [false, false, true, true, true, true, false, false],
  [false, false, true, true, true, true, false, false],
  [false, true, true, true, true, true, true, false],
  [false, true, true, true, true, true, true, false],
  [false, true, true, true, true, true, true, false],
  [false, false, false, false, false, false, false, false]
];

const fillablePositions = [];
for (let row = castleGrid.length - 1; row >= 0; row--) {
  for (let col = 0; col < castleGrid[row].length; col++) {
    if (castleGrid[row][col]) {
      fillablePositions.push({ row, col });
    }
  }
}
const fillableBlocks = fillablePositions.length;

// === Habit logic ===
function createHabitState(name) {
  return {
    name,
    days: Array(fillableBlocks).fill('missed')
  };
}

const presets = [
  "Drink Water",
  "Meditate",
  "Walk Outside",
  "Read",
  "Sleep Early"
];

function App() {
  // Two habits tracked at once
  const [habitStates, setHabitStates] = useState([
    createHabitState("Drink Water"),
    createHabitState("Read"),
  ]);

  // Handler for changing habit name (resets streak)
  function handleSelectHabit(idx, name) {
    setHabitStates(states => {
      const arr = [...states];
      arr[idx] = createHabitState(name);
      return arr;
    });
  }

  // Handler for logging today for a habit
  function handleLog(idx) {
    setHabitStates(prev =>
      prev.map((h, i) => {
        if (i !== idx) return h;
        const nextDays = [...h.days];
        const firstMissed = nextDays.findIndex(d => d === 'missed');
        if (firstMissed !== -1) nextDays[firstMissed] = 'completed';
        return { ...h, days: nextDays };
      })
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="bg-blue-500 text-white p-8 w-full">
        <h1>Habit Tracker MVP</h1>
        <p>Track up to <b>2 habits</b> at once.</p>
      </div>
      <div className="flex gap-8 mb-6">
        {habitStates.map((h, idx) => (
          <HabitSelector
            key={idx}
            value={h.name}
            onSelect={name => handleSelectHabit(idx, name)}
          />
        ))}
      </div>
      <div className="flex gap-8 mt-2 flex-wrap justify-center">
        {habitStates.map((h, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <h2 className="text-lg text-white mb-2">{h.name}</h2>
            {/* Castle grid blocks with requested styling */}
            <div
              className="relative flex justify-center items-center"
              style={{
                width: '384px',
                height: '384px',
              }}
            >
              <img
                src="/Castle-Basic.jpg"
                alt="Castle"
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
                style={{ zIndex: 0 }}
              />
              <div
                className="grid grid-cols-8 gap-2"
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                }}
              >
                {castleGrid.map((rowArr, rowIdx) =>
                  rowArr.map((canFill, colIdx) => {
                    const fillIndex = fillablePositions.findIndex(
                      pos => pos.row === rowIdx && pos.col === colIdx
                    );
                    // Only care about filled (completed) vs not
                    let isFilled = canFill && fillIndex > -1 && h.days[fillIndex] === 'completed';
                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        style={{ width: '40px', height: '40px' }}
                        className={
                          !canFill
                            ? "bg-transparent border-none"
                            : `border border-gray-400 rounded ${
                                isFilled
                                  ? "bg-gray-400 bg-opacity-100"
                                  : "bg-gray-400 bg-opacity-20"
                              }`
                        }
                      />
                    );
                  })
                )}
              </div>
            </div>
            <LogButton
              onClick={() => handleLog(idx)}
              disabled={!h.days.includes('missed')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
