import { db, auth } from './firebase';
import { setDoc, getDoc, doc } from 'firebase/firestore';

export async function createHabit(habitId, habitData) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  await setDoc(doc(db, "users", user.uid, "habits", habitId), habitData, { merge: true });
}

// Always return both habit slots
export async function getHabits() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");
  const habitIds = ["habit1", "habit2"];
  const habits = await Promise.all(
    habitIds.map(async (id) => {
      const docRef = doc(db, "users", user.uid, "habits", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id, ...docSnap.data() } : null;
    })
  );
  return habits.map((h, i) =>
    h ||
    {
      id: habitIds[i],
      name: "",
      days: Array(32).fill("missed"),
    }
  );
}
