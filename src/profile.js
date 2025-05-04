// profile.js

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to fetch the current user's profile data
async function loadProfile() {
  const user = auth.currentUser;
  
  if (!user) {
    alert("No user logged in.");
    window.location.href = "login.html"; // Redirect to login page if no user is found
    return;
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    
    // Fill in the profile fields with the fetched user data
    document.getElementById("profileName").value = userData.name || user.displayName;
    document.getElementById("profileEmail").value = user.email;
  } else {
    alert("No profile data found.");
  }
}

// Function to handle profile updates
async function updateProfileInfo() {
  const user = auth.currentUser;

  if (!user) {
    alert("No user logged in.");
    window.location.href = "login.html"; // Redirect to login if no user is found
    return;
  }

  const newName = document.getElementById("profileName").value.trim();
  const newEmail = document.getElementById("profileEmail").value.trim();
  
  try {
    // Update display name in Firebase Auth
    if (newName !== user.displayName) {
      await updateProfile(user, { displayName: newName });
    }

    // Update email in Firebase Authentication (only if needed)
    if (newEmail !== user.email) {
      await user.updateEmail(newEmail);
    }

    // Update user data in Firestore
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      name: newName,
      email: newEmail
    });

    alert("Profile updated successfully.");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile. Please try again.");
  }
}

// Event listener for form submission
document.getElementById("updateProfileBtn").addEventListener("click", updateProfileInfo);

// Load the profile data when the page loads
window.addEventListener("DOMContentLoaded", loadProfile);
