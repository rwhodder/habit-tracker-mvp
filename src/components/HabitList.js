import React from 'react';
import HabitCard from './HabitCard';

function HabitList({
  habits,
  onToggleClue,
  onSuccess,
  onMissed,
  onSimulate,
  onRepair,
  successPops,
  blockShake,
  towerShake,
  showCelebration,
}) {
  return (
    <div style={{ marginTop: 32 }}>
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggleClue={onToggleClue}
          onSuccess={onSuccess}
          onMissed={onMissed}
          onSimulate={onSimulate}
          onRepair={onRepair}
          successPops={successPops}
          blockShake={blockShake}
          towerShake={towerShake}
          showCelebration={showCelebration}
        />
      ))}
    </div>
  );
}

export default HabitList;
