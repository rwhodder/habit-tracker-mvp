// src/components/HabitItem.js
import React from 'react';
import HabitTower from './HabitTower';

function HabitItem({ habit, onEdit, onDelete }) {
  return (
    <li style={{ marginBottom: 24, border: "1px solid #ddd", padding: 8 }}>
      <strong>{habit.name}</strong>
      <button
        style={{ marginLeft: 12 }}
        onClick={() =>
          onEdit(habit.id, prompt("New name:", habit.name) || habit.name)
        }
      >Rename</button>
      <button
        style={{ marginLeft: 8 }}
        onClick={() => onDelete(habit.id)}
      >Delete</button>
      <div style={{ marginTop: 8 }}>
        {habit.contextCues?.length > 0 && (
          <span>Context Cues: {habit.contextCues.map(c => c.cue).join(', ')}</span>
        )}
      </div>
      <HabitTower habit={habit} />
    </li>
  );
}

export default HabitItem;
