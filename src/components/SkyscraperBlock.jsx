import React from 'react';

const colorMap = {
  completed: 'bg-green-500',
  grace: 'bg-yellow-400',
  missed: 'bg-red-500'
};

const SkyscraperBlock = ({ days }) => (
  <div className="flex flex-col items-center space-y-2">
    {days.map((state, i) => (
      <div
        key={i}
        className={`w-8 h-8 rounded ${colorMap[state] || 'bg-gray-300'} border`}
        title={state}
      />
    ))}
  </div>
);

export default SkyscraperBlock;
