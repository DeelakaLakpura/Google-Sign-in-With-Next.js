"use client";
import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, provider, db } from "./lib/firebaseConfig";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        storeUserData(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  const storeUserData = (user: User) => {
    const userRef = ref(db, `users/${user.uid}`);
    set(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      providerId: user.providerData[0]?.providerId,
    })
      .then(() => console.log("User data stored successfully."))
      .catch((error) => console.error("Error storing user data:", error));
  };

  return (
<div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome to Our App!
          </h1>
          <p className="text-gray-500 mb-6">
            Sign in to explore personalized features and services.
          </p>

          {user ? (
            <div className="animate-fadeIn">
              <img
                src={user.photoURL || "/avatar-placeholder.png"}
                alt="User Avatar"
                className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md"
              />
              <h2 className="text-xl font-semibold text-gray-700">
                {user.displayName}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              <button
                onClick={handleSignOut}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
              </button>
            </div>
          ) : (
            <button
    onClick={handleGoogleSignIn}
    className="px-6 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center mx-auto"
  >
    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" className="w-6 h-6" />
    <span className="font-medium text-lg text-1xl text-black">&nbsp; Sign in with Google</span>
  </button>
          )}
        </div>

       
      </div>
    </div>
  );
}
