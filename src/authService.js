import { auth } from "./authService.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form elements
  const form = document.getElementById("signupForm");
  const submitBtn = document.getElementById("createAccountBtn");
  const successMessage = document.getElementById("successMessage");
  const countdownElement = document.getElementById("countdown");

  // Get form values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const userRole = document.getElementById("role").value; // Get the selected role (doctor or patient)

  // Validate inputs
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Set loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName: fullName,
    });

    // Send verification email
    await sendEmailVerification(user);

    // Store user role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: fullName,
      email: email,
      role: userRole, // Store role (doctor or patient)
    });

    // Sign out to enforce email verification
    await signOut(auth);

    // Hide form and show success message
    form.style.display = "none";
    successMessage.style.display = "block";

    // Start countdown for redirect
    let seconds = 5;
    countdownElement.textContent = seconds;
    
    const countdownInterval = setInterval(() => {
      seconds--;
      countdownElement.textContent = seconds;
      
      if (seconds <= 0) {
        clearInterval(countdownInterval);
        window.location.href = "login.html";
      }
    }, 1000);

  } catch (error) {
    console.error("Signup Error:", error);
    
    // Show user-friendly error messages
    let errorMessage = "Signup failed. Please try again.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered. Please use a different email.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password should be at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Please enter a valid email address.";
    }
    
    alert(errorMessage);
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
});
