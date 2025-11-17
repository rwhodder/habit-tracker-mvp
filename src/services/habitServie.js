// src/services/habitService.js
import { db, auth } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Create or update a habit for the current user
export async function createHabit(habitId, habitData) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  await setDoc(doc(db, "users", user.uid, "habits", habitId), habitData, { merge: true });
}

// Get all habits for the current user
export async function getHabits() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  const habitsRef = collection(db, "users", user.uid, "habits");
  const snapshot = await getDocs(habitsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Log a day's completion for a habit
export async function logDay(habitId, date, logData) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  const dayRef = doc(db, "users", user.uid, "habits", habitId, "logs", date);
  await setDoc(dayRef, logData, { merge: true });
}

// Get all log entries for a habit
export async function getHabitHistory(habitId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  const logsCol = collection(db, "users", user.uid, "habits", habitId, "logs");
  const snapshot = await getDocs(logsCol);
  return snapshot.docs.map(doc => ({ date: doc.id, ...doc.data() }));
}
