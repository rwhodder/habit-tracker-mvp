// src/components/Auth/AuthWrapper.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import Login from "./Login";

function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <div className="flex justify-end p-2">
        <span className="mr-3">Signed in as: {user.email}</span>
        <button
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
          onClick={() => signOut(auth)}
        >
          Sign Out
        </button>
      </div>
      {children}
    </>
  );
}

export default AuthWrapper;
