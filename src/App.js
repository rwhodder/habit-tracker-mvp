import React, { useState } from 'react';
import LogButton from './components/LogButton/LogButton';

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
      fillablePositions.push({row, col});
    }
  }
}
const fillableBlocks = fillablePositions.length;

function App() {
  const [progress, setProgress] = useState(1);

  const handleLog = () => {
    if (progress < fillableBlocks) {
      setProgress(progress + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="bg-blue-500 text-white p-8 w-full">
        <h1>Habit Tracker MVP</h1>
        <p>Tailwind CSS is working!</p>
      </div>
      <div className="flex justify-center py-6">
        <LogButton onClick={handleLog} />
      </div>
      <div
        className="relative flex justify-center items-center"
        style={{
          width: '384px',
          height: '384px',
        }}
      >
        <img
          src="/Castle-Basic.jpg"
          alt="Castle Background"
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
              let fillIndex = fillablePositions.findIndex(
                pos => pos.row === rowIdx && pos.col === colIdx
              );
              let isFilled = canFill && fillIndex > -1 && fillIndex < progress;

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  style={{ width: '40px', height: '40px' }}
                  className={
                    !canFill
                      ? "bg-transparent border-none"
                      : `border border-white rounded ${
                          isFilled
                            ? "bg-gray-400"
                            : "bg-white bg-opacity-10"
                        }`
                  }
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
