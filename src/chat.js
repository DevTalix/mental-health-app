import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();

// DOM Elements
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');

// Ensure user is logged in
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    // Start listening for messages once user is authenticated
    listenForMessages();
  }
});

// Handle message form submit
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const messageText = messageInput.value.trim();

  if (!messageText) return;

  try {
    await addDoc(collection(db, "messages"), {
      text: messageText,
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName || "Anonymous",
      timestamp: new Date()
    });

    messageInput.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message.");
  }
});

// Realtime listener
function listenForMessages() {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  onSnapshot(q, snapshot => {
    chatMessages.innerHTML = "";

    snapshot.forEach(doc => {
      const msg = doc.data();
      const msgEl = document.createElement('div');
      msgEl.className = 'chat-message';
      msgEl.innerHTML = `<strong>${msg.name}</strong>: ${msg.text}`;
      chatMessages.appendChild(msgEl);
    });

    // Scroll to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}
