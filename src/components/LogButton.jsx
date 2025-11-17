// LogButton.jsx
import React from 'react';

export default function LogButton({ onClick, disabled, date }) {
  const labelDate = date
    ? new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    : new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        disabled
          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
      aria-label={`Log habit for ${labelDate}`}
    >
      Log Today ({labelDate})
    </button>
  );
}
