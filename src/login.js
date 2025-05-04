// Import Firebase Auth functions
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig.js";  // Ensure firebaseConfig is exported in your Firebase configuration

// Initialize Firebase and Auth
const auth = getAuth();

// Select the login button and form inputs
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    // Sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      alert("Please verify your email address before logging in. Check your inbox.");
      return;
    }

    // Redirect to dashboard
    console.log("User logged in:", user);
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Login error:", error.code, error.message);

    switch (error.code) {
      case "auth/invalid-email":
        alert("Invalid email address.");
        break;
      case "auth/user-disabled":
        alert("This account has been disabled.");
        break;
      case "auth/user-not-found":
        alert("No user found with this email.");
        break;
      case "auth/wrong-password":
        alert("Incorrect password. Please try again.");
        break;
      default:
        alert("Login failed. Please try again.");
    }
  }
});

// Signup link redirect
const signupLink = document.getElementById("signupLink");
if (signupLink) {
  signupLink.addEventListener("click", () => {
    window.location.href = "signup.html";
  });
}


// Guest login
const guestBtn = document.getElementById("guestBtn");
if (guestBtn) {
  guestBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}
