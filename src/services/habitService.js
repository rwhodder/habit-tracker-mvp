// src/services/habitService.js
import { v4 as uuidv4 } from "uuid";

// How many total blocks can a habit earn in its tower.
const MAX_BLOCKS = 12;

export function addHabit(existingHabits, name, contextCues = []) {
  const newHabit = {
    id: uuidv4(),
    name,
    contextCues,        // [{ cue, done }]
    blocksEarned: 0,    // how many blocks are currently unlocked
    maxBlocks: MAX_BLOCKS
  };

  return [...existingHabits, newHabit];
}

export function serializeHabits(habits) {
  return habits.map((h) => ({
    id: h.id,
    name: h.name,
    contextCues: h.contextCues || [],
    blocksEarned: typeof h.blocksEarned === "number" ? h.blocksEarned : 0,
    maxBlocks: typeof h.maxBlocks === "number" ? h.maxBlocks : MAX_BLOCKS
  }));
}

export function hydrateHabits(raw) {
  if (!Array.isArray(raw)) return [];

  return raw.map((h) => ({
    id: h.id,
    name: h.name,
    contextCues: (h.contextCues || []).map((c) => ({
      cue: c.cue || "",
      done: !!c.done
    })),
    blocksEarned:
      typeof h.blocksEarned === "number" ? h.blocksEarned : 0,
    maxBlocks:
      typeof h.maxBlocks === "number" ? h.maxBlocks : MAX_BLOCKS
  }));
}
