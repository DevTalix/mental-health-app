// Import Firebase Auth functions
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Initialize Firebase Auth
const auth = getAuth();

// Elements
const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Display user info
    const displayName = user.displayName || "User";
    welcomeMessage.textContent = `Welcome, ${displayName}!`;
  } else {
    // Redirect to login if not authenticated
    window.location.href = "index.html";
  }
});

// Logout functionality
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html"; // Redirect to login after logout
  } catch (error) {
    console.error("Logout Error:", error);
    alert("An error occurred while logging out.");
  }
});
