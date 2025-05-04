import { register, login, logout } from './authService.js';
import { auth } from './firebaseConfig.js';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig.js';
import { doc, setDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const guestBtn = document.getElementById('guestBtn');
const loginPage = document.getElementById('loginPage');
const chatPage = document.getElementById('chatPage');
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resourcesPage = document.getElementById('resourcesPage');
const resourcesContainer = document.getElementById('resourcesContainer');

// Show Chat Page on Successful Auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginPage.style.display = 'none';
    chatPage.style.display = 'block';
    console.log("User logged in:", user.email || "Guest");
  } else {
    loginPage.style.display = 'block';
    chatPage.style.display = 'none';
  }
});

// Function to Save Chat Logs in Firestore
const saveChatLog = async (userId, message, response) => {
  const chatRef = doc(db, 'users', userId);
  await setDoc(chatRef, {
    chatLogs: arrayUnion({ message, response, timestamp: new Date() }),
  }, { merge: true });
};

// Function to Display Chat Messages
const displayMessage = (message, sender = 'user') => {
  const messageElem = document.createElement('div');
  messageElem.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
  messageElem.textContent = message;
  chatbox.appendChild(messageElem);
  chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to latest message
};

// Function to Handle User Input and Provide Response
const handleChat = async () => {
  const userMessage = userInput.value.trim();

  if (userMessage) {
    displayMessage(userMessage, 'user');
    userInput.value = ''; // Clear input field

    // Simulating response generation (you can expand this with more advanced logic)
    let response = '';
    if (userMessage.toLowerCase().includes('anxious')) {
      response = "I'm sorry you're feeling anxious. Try some deep breathing exercises.";
    } else if (userMessage.toLowerCase().includes('stressed')) {
      response = "It's okay to feel stressed. Maybe take a break and go for a walk.";
    } else if (userMessage.toLowerCase().includes('sad')) {
      response = "Sadness is a natural feeling. Reach out to someone you trust.";
    } else {
      response = "I'm here to help. Can you tell me more about what you're feeling?";
    }

    displayMessage(response, 'bot');

    // Store chat logs in Firestore if the user is authenticated
    const user = auth.currentUser;
    if (user) {
      await saveChatLog(user.uid, userMessage, response);
    }
  }
};

// Fetch and Display Resources from Firestore
const loadResources = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "resources"));
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const resource = doc.data();
        // Create an element for each resource
        const resourceElem = document.createElement('div');
        resourceElem.classList.add('resource');
        resourceElem.innerHTML = `
          <h3>${resource.title}</h3>
          <p>${resource.description}</p>
          <a href="${resource.url}" target="_blank" class="resource-link">Read More</a>
        `;
        resourcesContainer.appendChild(resourceElem);
      });
    } else {
      resourcesContainer.innerHTML = '<p>No resources available at the moment.</p>';
    }
  } catch (error) {
    console.error('Error fetching resources:', error);
    resourcesContainer.innerHTML = '<p>Failed to load resources. Please try again later.</p>';
  }
};

// Event Listeners
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await login(email, password);
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error.message);
    alert('Login failed: ' + error.message);
  }
});

signupBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await register(email, password);
    console.log('Registration successful');
  } catch (error) {
    console.error('Sign-up failed:', error.message);
    alert('Sign-up failed: ' + error.message);
  }
});

guestBtn.addEventListener('click', async () => {
  try {
    await signInAnonymously(auth);
    console.log('Signed in as guest');
  } catch (error) {
    console.error('Guest login failed:', error.message);
    alert('Guest login failed: ' + error.message);
  }
});

// Send Button (Submit Chat)
sendBtn.addEventListener('click', handleChat);

// Optional: Handle Enter key for sending messages
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleChat();
  }
});

// Load Resources on page load
document.addEventListener('DOMContentLoaded', loadResources);
