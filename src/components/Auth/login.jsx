// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { auth } from "../../services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white shadow p-8 rounded w-80">
        <h2 className="text-2xl mb-4 text-center">
          {mode === "login" ? "Sign In" : "Register"}
        </h2>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border rounded px-3 py-2"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="border rounded px-3 py-2"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
            type="submit"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="text-sm mt-4 text-center">
          {mode === "login" ? (
            <>
              New user?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode("register")}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
