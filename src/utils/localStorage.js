// src/utils/localStorage.js

// Util for blank habit (needed for fallback)
export function createHabitState(name, fillableBlocks) {
  return {
    name,
    days: Array(fillableBlocks).fill('missed')
  };
}

export function saveHabitsToStorage(habitStates) {
  localStorage.setItem("habits", JSON.stringify(habitStates));
}

export function loadHabitsFromStorage(fillableBlocks) {
  const data = localStorage.getItem("habits");
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [
        createHabitState("", fillableBlocks),
        createHabitState("", fillableBlocks)
      ];
    }
  }
  return [
    createHabitState("", fillableBlocks),
    createHabitState("", fillableBlocks)
  ];
}
