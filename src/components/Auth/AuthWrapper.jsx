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
      <div
        style={{
          width: "100%",
          backgroundColor: "#F20530",
          color: "#F2E5D5",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "8px 24px",
          fontFamily:
            '"Futura", "Futura PT", "Century Gothic", "Avenir Next", sans-serif',
          fontWeight: 700,
          fontSize: "1.13rem",
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ marginRight: "16px" }}>
          Signed in as: {user.email}
        </span>
        <button
          style={{
            background: "#F2E5D5",
            color: "#F20530",
            fontWeight: 700,
            border: "none",
            borderRadius: "6px",
            padding: "7px 18px",
            cursor: "pointer",
            fontFamily:
              '"Futura", "Futura PT", "Century Gothic", "Avenir Next", sans-serif',
            fontSize: "1.08rem",
            transition: "background 0.2s, color 0.2s",
          }}
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
