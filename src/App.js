// src/App.js
import React, { useState, useEffect } from 'react';
import LogButton from './components/LogButton';
import SubmitButton from './components/SubmitButton';
import { createHabitState } from './utils/localStorage';
import AuthWrapper from './components/Auth/AuthWrapper';
import { getHabits, createHabit } from './services/habitService';

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
    if (castleGrid[row][col]) fillablePositions.push({ row, col });
  }
}
const fillableBlocks = fillablePositions.length;

// Helper to find the last filled/animated block index
function getLastFilledIndex(days, prevDays) {
  if (!prevDays) return -1;
  for (let i = 0; i < days.length; i++) {
    if (
      (days[i] === 'completed' || days[i] === 'grace') &&
      prevDays[i] === 'missed'
    ) {
      return i;
    }
  }
  return -1;
}

function App() {
  const [habitStates, setHabitStates] = useState(null);
  const [habitInputs, setHabitInputs] = useState([null, null]);
  const [inputVisible, setInputVisible] = useState([null, null]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  // New: track the previous state for animation
  const [prevHabitStates, setPrevHabitStates] = useState([null, null]);

  // Load habits from Firestore on mount
  useEffect(() => {
    async function fetchHabits() {
      try {
        setErrorMessage("");
        const habits = await getHabits();
        setHabitStates(habits);
        setInputVisible([
          !habits[0]?.name,
          !habits[1]?.name,
        ]);
        setHabitInputs([
          habits[0]?.name || "",
          habits[1]?.name || "",
        ]);
        setPrevHabitStates([null, null]); // Clear previous on fresh load
      } catch (e) {
        setErrorMessage("Could not load from cloud, using local defaults instead.");
        setHabitStates([
          createHabitState("", fillableBlocks),
          createHabitState("", fillableBlocks)
        ]);
        setInputVisible([true, true]);
        setHabitInputs(["", ""]);
        setPrevHabitStates([null, null]);
      } finally {
        setLoading(false);
      }
    }
    fetchHabits();
  }, []);

  async function handleNameSubmit(idx) {
    if (habitInputs[idx]?.trim()) {
      try {
        setErrorMessage("");
        const updatedHabits = [...habitStates];
        updatedHabits[idx] = {
          ...updatedHabits[idx],
          name: habitInputs[idx].trim()
        };
        await createHabit(`habit${idx + 1}`, updatedHabits[idx]);
        const habits = await getHabits();
        setHabitStates(habits);
        setInputVisible([
          !habits[0]?.name,
          !habits[1]?.name,
        ]);
        setHabitInputs([
          habits[0]?.name || "",
          habits[1]?.name || "",
        ]);
        setPrevHabitStates([null, null]);
      } catch (e) {
        setErrorMessage("Saving habit name failed. Please try again.");
      }
    }
  }

  async function handleLog(idx) {
    setPrevHabitStates(habitStates); // Track previous for animation
    const updatedHabits = habitStates.map((h, i) => {
      if (i !== idx) return h;
      const nextDays = [...h.days];
      const firstMissed = nextDays.findIndex(d => d === 'missed');
      if (firstMissed === -1) return h;
      const hasGrace = nextDays.includes('grace');
      if (!hasGrace) {
        nextDays[firstMissed] = 'grace';
      } else {
        nextDays[firstMissed] = 'completed';
      }
      return { ...h, days: nextDays };
    });
    setHabitStates(updatedHabits);

    try {
      await createHabit(`habit${idx + 1}`, updatedHabits[idx]);
    } catch (e) {
      setErrorMessage("Could not sync log to cloud. Your castle still updated locally.");
    }
  }

  if (
    loading ||
    habitStates === null ||
    inputVisible[0] === null ||
    inputVisible[1] === null ||
    habitInputs[0] === null ||
    habitInputs[1] === null
  ) {
    return (
      <AuthWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
          <div className="text-xl mb-2">Loading your habits...</div>
          <div className="text-sm text-gray-400">This usually takes just a moment.</div>
        </div>
      </AuthWrapper>
    );
  }

  // Main dashboard UI
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-black flex flex-col items-center">
        <div className="bg-blue-500 text-white p-8 w-full">
          <h1>Habit Tracker MVP</h1>
          <p>Track up to <b>2 habits</b>. State always persists and is editable.</p>
          {errorMessage && (
            <p className="mt-2 text-sm text-yellow-200">{errorMessage}</p>
          )}
        </div>

        <div className="flex gap-8 mb-6">
          {habitStates.map((_, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {inputVisible[idx] && (
                <div className="flex items-center">
                  <input
                    type="text"
                    className="bg-gray-200 rounded p-2 mx-2 mb-2 text-center"
                    placeholder={`Enter habit ${idx + 1}`}
                    value={habitInputs[idx]}
                    onChange={e => setHabitInputs(inputs =>
                      inputs.map((iv, i) => (i === idx ? e.target.value : iv))
                    )}
                    style={{ minWidth: "140px", fontSize: "1.1rem" }}
                  />
                  <SubmitButton
                    disabled={!habitInputs[idx]?.trim()}
                    onClick={() => handleNameSubmit(idx)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-8 mt-2 flex-wrap justify-center">
          {habitStates.map((h, idx) => {
            // For each habit, get which block should animate
            const lastFilled = getLastFilledIndex(h.days, prevHabitStates?.[idx]?.days ?? null);

            return (
              <div key={idx} className="flex flex-col items-center">
                {!inputVisible[idx] && (
                  <>
                    <h2 className="text-lg text-white mb-2">{h.name}</h2>
                    <div
                      className="relative flex justify-center items-center"
                      style={{ width: '384px', height: '384px' }}
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
                            const popClass = fillIndex === lastFilled ? "block-pop" : "";
                            return (
                              <div
                                key={`${rowIdx}-${colIdx}`}
                                style={{ width: '40px', height: '40px' }}
                                className={
                                  !canFill
                                    ? "bg-transparent border-none"
                                    : `border border-gray-400 rounded ${
                                        fillState === 'completed'
                                          ? `bg-gray-400 bg-opacity-100 ${popClass}`
                                          : fillState === 'grace'
                                            ? `bg-yellow-400 bg-opacity-100 ${popClass}`
                                            : "bg-gray-400 bg-opacity-20"
                                      }`
                                }
                                title={fillState}
                              >
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <LogButton
                      onClick={() => handleLog(idx)}
                      disabled={!h.days.includes('missed')}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AuthWrapper>
  );
}

export default App;
