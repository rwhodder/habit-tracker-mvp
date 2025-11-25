import { v4 as uuidv4 } from 'uuid';

export function createHabit(name) {
  return {
    id: uuidv4(),
    name,
    days: [],
    contextCues: [],
    blockStates: [],
    streak: 0,
    repairs: 0,
    skin: "",
    milestones: [],
  };
}

export function addHabit(habits, habitName, contextCues = [], blockStates = []) {
  const newHabit = createHabit(habitName);
  newHabit.contextCues = contextCues;
  newHabit.blockStates = blockStates;
  return [...habits, newHabit];
}



export function updateHabit(habits, habitId, updatedFields) {
  return habits.map(habit =>
    habit.id === habitId ? { ...habit, ...updatedFields } : habit
  );
}

export function deleteHabit(habits, habitId) {
  return habits.filter(habit => habit.id !== habitId);
}
