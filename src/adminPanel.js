// adminPanel.js
import { db } from './firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

// DOM Element for Admin Panel
const supportRequestsList = document.getElementById('supportRequestsList');
const logoutAdminBtn = document.getElementById('logoutAdminBtn');

// Function to Fetch Support Requests from Firestore
const loadSupportRequests = async () => {
  const querySnapshot = await getDocs(collection(db, 'supportRequests'));
  querySnapshot.forEach((doc) => {
    const request = doc.data();
    const requestElem = document.createElement('div');
    requestElem.classList.add('support-request');
    requestElem.innerHTML = `
      <h4>${request.name}</h4>
      <p><strong>Email:</strong> ${request.email}</p>
      <p><strong>Message:</strong> ${request.message}</p>
    `;
    supportRequestsList.appendChild(requestElem);
  });
};

// Logout Function for Admin
logoutAdminBtn.addEventListener('click', () => {
  adminPanelPage.style.display = 'none';
  adminLoginPage.style.display = 'block';
  console.log('Admin logged out');
});

// Load Support Requests when Admin Panel is displayed
const displayAdminPanel = () => {
  loadSupportRequests();
  adminPanelPage.style.display = 'block';
  adminLoginPage.style.display = 'none';
};
