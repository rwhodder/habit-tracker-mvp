import React from 'react';

const presets = [
  "Drink Water",
  "Meditate",
  "Walk Outside",
  "Read",
  "Sleep Early"
];

export default function HabitSelector({ value, onSelect }) {
  return (
    <select
      value={value}
      onChange={e => onSelect(e.target.value)}
      className="bg-gray-200 rounded p-2 mx-2 mb-2"
    >
      {presets.map(h => <option key={h} value={h}>{h}</option>)}
    </select>
  );
}
