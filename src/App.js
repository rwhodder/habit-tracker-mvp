import React, { useState, useEffect } from 'react';
import LogButton from './components/LogButton';
import { saveHabitsToStorage, loadHabitsFromStorage, createHabitState } from './utils/localStorage';
import AuthWrapper from './components/Auth/AuthWrapper'; // <-- Add this import

// Castle layout grid setup
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

function App() {
  // Load habits from localStorage when app loads
  const [habitStates, setHabitStates] = useState(() => loadHabitsFromStorage(fillableBlocks));

  // Save habits to localStorage every time they change
  useEffect(() => {
    saveHabitsToStorage(habitStates);
  }, [habitStates]);

  // Handler for changing habit name (resets streak for that habit)
  function handleCustomHabit(idx, name) {
    setHabitStates(states => {
      const arr = [...states];
      arr[idx] = createHabitState(name, fillableBlocks);
      return arr;
    });
  }

  // Handler for logging today for a habit
  function handleLog(idx) {
    setHabitStates(prev =>
      prev.map((h, i) => {
        if (i !== idx) return h;
        const nextDays = [...h.days];
        // Find first missed day
        const firstMissed = nextDays.findIndex(d => d === 'missed');
        if (firstMissed === -1) return h;
        // Only fill 'grace' if not already present in array for this habit
        const hasGrace = nextDays.includes('grace');
        if (!hasGrace) {
          nextDays[firstMissed] = 'grace';
        } else {
          nextDays[firstMissed] = 'completed';
        }
        return { ...h, days: nextDays };
      })
    );
  }

  return (
    <AuthWrapper> {/* <-- Only this line and the closing tag at very bottom are new */}
      <div className="min-h-screen bg-black flex flex-col items-center">
        <div className="bg-blue-500 text-white p-8 w-full">
          <h1>Habit Tracker MVP</h1>
          <p>Track up to <b>2 habits</b> at once, with logs saved in your browser.</p>
        </div>
        {/* Input boxes for custom habits */}
        <div className="flex gap-8 mb-6">
          {habitStates.map((h, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <input
                type="text"
                className="bg-gray-200 rounded p-2 mx-2 mb-2 text-center"
                placeholder={`Enter habit ${idx + 1}`}
                value={h.name}
                onChange={e => handleCustomHabit(idx, e.target.value)}
                style={{ minWidth: "140px", fontSize: "1.1rem" }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-8 mt-2 flex-wrap justify-center">
          {habitStates.map((h, idx) => h.name && (
            <div key={idx} className="flex flex-col items-center">
              <h2 className="text-lg text-white mb-2">{h.name}</h2>
              {/* Castle grid blocks with requested styling and grace day color */}
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
                      let fillState = canFill && fillIndex > -1 ? h.days[fillIndex] : null;
                      return (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          style={{ width: '40px', height: '40px' }}
                          className={
                            !canFill
                              ? "bg-transparent border-none"
                              : `border border-gray-400 rounded ${
                                  fillState === 'completed'
                                    ? "bg-gray-400 bg-opacity-100"
                                    : fillState === 'grace'
                                    ? "bg-yellow-400 bg-opacity-100"
                                    : "bg-gray-400 bg-opacity-20"
                                }`
                          }
                          title={fillState}
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
    </AuthWrapper> // <-- Insert this closing tag at the end, wrapping all the app's HTML
  );
}

export default App;
