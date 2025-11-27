// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import HabitSelector from "./components/HabitSelector";
import { addHabit, hydrateHabits, serializeHabits } from "./services/habitService";

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [showContextClues, setShowContextClues] = useState(false);
  const [contextClueInputs, setContextClueInputs] = useState(["", "", ""]);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  // Load habits
  useEffect(() => {
    try {
      const stored = localStorage.getItem("habits");
      if (stored) {
        const parsed = JSON.parse(stored);
        setHabits(hydrateHabits(parsed));
      }
    } catch (e) {
      console.error("Failed to load habits", e);
    }
  }, []);

  // Save habits
  useEffect(() => {
    try {
      const serialised = serializeHabits(habits);
      localStorage.setItem("habits", JSON.stringify(serialised));
    } catch (e) {
      console.error("Failed to save habits", e);
    }
  }, [habits]);

  const handleStartAddHabit = (e) => {
    e.preventDefault();
    const trimmed = newHabitName.trim();
    if (!trimmed) return;
    setShowContextClues(true);
  };

  const handleAddContextClues = (e) => {
    e.preventDefault();

    const cues = contextClueInputs
      .map((str) => str.trim())
      .filter((str) => str.length > 0)
      .map((cue) => ({ cue, done: false }));

    if (cues.length === 0) {
      alert("Add at least one When/Where context (e.g., “after coffee”).");
      return;
    }

    const name = newHabitName.trim();
    setHabits((prev) => addHabit(prev, name, cues));

    setNewHabitName("");
    setShowContextClues(false);
    setContextClueInputs(["", "", ""]);
  };

  const handleCancelContextClues = () => {
    setShowContextClues(false);
    setContextClueInputs(["", "", ""]);
  };

  // When ALL cues for a habit are done (after this click), user earns ONE tower block.
  const handleToggleContextCue = (habitId, cueIndex) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const prevCues = habit.contextCues || [];
        if (prevCues.length === 0) {
          return habit;
        }

        const prevAllDone = prevCues.every((c) => c.done === true);

        // First, toggle the clicked cue, producing a NEW array
        const toggledCues = prevCues.map((c, i) =>
          i === cueIndex ? { ...c, done: !c.done } : { ...c }
        );

        const nowAllDone = toggledCues.every((c) => c.done === true);

        let blocksEarned = habit.blocksEarned || 0;
        const maxBlocks = habit.maxBlocks || 12;

        // Default: just use the toggled cues
        let finalCues = toggledCues;

        // Only award a block when we go from NOT all done -> ALL done
        if (!prevAllDone && nowAllDone && blocksEarned < maxBlocks) {
          blocksEarned += 1;
          // Build a completely fresh array with done reset to false
          finalCues = toggledCues.map((c) => ({
            cue: c.cue,
            done: false
          }));
        }

        return {
          ...habit,
          contextCues: finalCues,
          blocksEarned,
          maxBlocks
        };
      })
    );
  };

  const selectedHabit =
    habits.find((h) => h.id === selectedHabitId) || null;

  return (
    <div className="App">
      <header className="app-header">
        <h1>Habit Tower</h1>
        <p>Stack habits with concrete When/Where cues to lock in your streaks.</p>
      </header>

      <main className="app-main">
        <section className="habit-list-section">
          <form onSubmit={handleStartAddHabit} className="add-habit-form">
            <label htmlFor="habitName">New Habit</label>
            <input
              id="habitName"
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g., Read 1 page"
            />
            <button type="submit">Next: When/Where</button>
          </form>

          <ul className="habit-list">
            {habits.map((habit) => (
              <li
                key={habit.id}
                className={
                  habit.id === selectedHabitId
                    ? "habit-item selected"
                    : "habit-item"
                }
                onClick={() => setSelectedHabitId(habit.id)}
              >
                <span className="habit-name">{habit.name}</span>
                {habit.contextCues && habit.contextCues.length > 0 && (
                  <div className="habit-context-summary">
                    {habit.contextCues.map((c, i) => (
                      <span key={i} className={c.done ? "cue done" : "cue"}>
                        {c.cue}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="habit-detail-section">
          {selectedHabit ? (
            <>
              <h2>{selectedHabit.name}</h2>

              <div className="context-cues-panel">
                <h3>When/Where steps</h3>
                <p className="microcopy">
                  Tap each step when it happens.  
                  Completing all steps once earns you one tower block.
                </p>
                {selectedHabit.contextCues.length === 0 && (
                  <p>No When/Where cues yet.</p>
                )}
                <ul className="context-cues-list">
                  {selectedHabit.contextCues.map((c, i) => (
                    <li key={i}>
                      <button
                        className={
                          c.done ? "context-cue-btn done" : "context-cue-btn"
                        }
                        onClick={() =>
                          handleToggleContextCue(selectedHabit.id, i)
                        }
                      >
                        {c.done ? "✓ " : ""}
                        {c.cue}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <HabitSelector habit={selectedHabit} />
            </>
          ) : (
            <div className="empty-state">
              <p>Select a habit to see its tower and When/Where steps.</p>
            </div>
          )}
        </section>
      </main>

      {showContextClues && (
        <div className="overlay-backdrop">
          <div className="overlay-card">
            <h2>When/Where will you do “{newHabitName.trim()}”?</h2>
            <p className="microcopy">
              Link this habit to 1–3 real moments in your day.  
              Example: “After my coffee”, “Before I open email”.
            </p>

            <form onSubmit={handleAddContextClues}>
              {contextClueInputs.map((val, idx) => (
                <div key={idx} className="context-input-row">
                  <label>When/Where {idx + 1}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const updated = [...contextClueInputs];
                      updated[idx] = e.target.value;
                      setContextClueInputs(updated);
                    }}
                    placeholder={
                      idx === 0
                        ? "e.g., After my morning coffee"
                        : idx === 1
                        ? "e.g., Before I start work"
                        : "e.g., When I sit on the couch"
                    }
                  />
                </div>
              ))}

              <div className="overlay-actions">
                <button type="button" onClick={handleCancelContextClues}>
                  Cancel
                </button>
                <button type="submit">Save Habit with When/Where</button>
              </div>
            </form>

            <div className="overlay-tip">
              <strong>Why this works:</strong>  
              Finishing all your When/Where steps turns one tiny run into a visible
              tower block, giving a clear achievement hit without any reminders.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
