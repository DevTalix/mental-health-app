// adminLogin.js
import { db } from './firebaseConfig.js'; // Ensure your Firebase config file is correct
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// DOM Elements
const adminEmailInput = document.getElementById('adminEmail');
const adminPasswordInput = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginPage = document.getElementById('adminLoginPage');
const adminPanelPage = document.getElementById('adminPanelPage');
const loginError = document.getElementById('loginError');

// Admin Login Function
const handleAdminLogin = async () => {
  const email = adminEmailInput.value.trim();
  const password = adminPasswordInput.value.trim();

  const auth = getAuth();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // On successful login, show the admin panel
    adminLoginPage.style.display = 'none';
    adminPanelPage.style.display = 'block';
    console.log('Admin logged in');
  } catch (error) {
    loginError.style.display = 'block';
    console.error('Login failed:', error.message);
  }
};

// Event Listener for Admin Login Button
adminLoginBtn.addEventListener('click', handleAdminLogin);
