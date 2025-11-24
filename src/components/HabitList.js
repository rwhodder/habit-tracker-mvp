// src/components/HabitList.js
import React from 'react';
import HabitItem from './HabitItem';

function HabitList({ habits, onEdit, onDelete }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {habits.map(habit => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default HabitList;
