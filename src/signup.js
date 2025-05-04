// src/signup.js
import { auth } from "./authService.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// DOM Elements
const signupForm = document.getElementById("signupForm");
const submitBtn = document.getElementById("createAccountBtn");
const successMessage = document.getElementById("successMessage");
const countdownElement = document.getElementById("countdown");

// Error messages mapping
const errorMessages = {
  "auth/email-already-in-use": "This email is already registered. Please use a different email.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/network-request-failed": "Network error. Please check your internet connection.",
  "default": "Signup failed. Please try again."
};

// Form submission handler
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate inputs
  if (!validateInputs(fullName, email, password, confirmPassword)) {
    return;
  }

  // Set loading state
  setLoadingState(true);

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, { displayName: fullName });

    // Send verification email
    await sendEmailVerification(user);

    // Sign out user to enforce email verification
    await signOut(auth);

    // Show success state
    showSuccessState();

    // Start redirect countdown
    startCountdown(5, () => {
      window.location.href = "login.html";
    });

  } catch (error) {
    handleSignupError(error);
  } finally {
    setLoadingState(false);
  }
});

/**
 * Validates form inputs
 */
function validateInputs(fullName, email, password, confirmPassword) {
  if (!fullName || !email || !password || !confirmPassword) {
    showError("Please fill in all fields.");
    return false;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match.");
    return false;
  }

  if (password.length < 6) {
    showError("Password should be at least 6 characters.");
    return false;
  }

  return true;
}

/**
 * Sets loading state during form submission
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";
    submitBtn.style.opacity = "0.7";
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
    submitBtn.style.opacity = "1";
  }
}

/**
 * Shows success message and hides form
 */
function showSuccessState() {
  signupForm.style.display = "none";
  successMessage.style.display = "block";
  
  // Add animation class
  successMessage.classList.add("show-success");
}

/**
 * Starts countdown timer for redirect
 */
function startCountdown(seconds, callback) {
  let remaining = seconds;
  countdownElement.textContent = remaining;

  const countdownInterval = setInterval(() => {
    remaining--;
    countdownElement.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      callback();
    }
  }, 1000);
}

/**
 * Handles signup errors with user-friendly messages
 */
function handleSignupError(error) {
  console.error("Signup Error:", error);
  
  const errorCode = error.code || "default";
  const message = errorMessages[errorCode] || errorMessages["default"];
  
  showError(message);
}

/**
 * Displays error message to user
 */
function showError(message) {
  // Remove any existing error messages
  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Create and display new error message
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.style.color = "#d32f2f";
  errorElement.style.margin = "10px 0";
  errorElement.style.padding = "10px";
  errorElement.style.backgroundColor = "#ffebee";
  errorElement.style.borderRadius = "4px";
  errorElement.textContent = message;

  // Insert after the form heading
  const formHeading = document.querySelector(".form-section h2");
  formHeading.insertAdjacentElement("afterend", errorElement);

  // Scroll to error message
  errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
}