// adminPanel.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Load all support requests from Firestore and display them in the admin panel.
 */
async function loadSupportRequests() {
  try {
    const supportRef = collection(db, "supportRequests");
    const snapshot = await getDocs(supportRef);
    const container = document.getElementById("supportRequestsContainer");

    container.innerHTML = ""; // Clear existing content

    if (snapshot.empty) {
      container.innerHTML = "<p>No support requests found.</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const requestElement = document.createElement("div");
      requestElement.classList.add("support-request");

      requestElement.innerHTML = `
        <p><strong>User ID:</strong> ${data.userID || "N/A"}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <p><strong>Status:</strong> <span id="status-${docSnap.id}">${data.status}</span></p>
        <button onclick="handleStatusUpdate('${docSnap.id}', 'resolved')">Mark as Resolved</button>
        <hr />
      `;

      container.appendChild(requestElement);
    });
  } catch (error) {
    console.error("Error loading support requests:", error);
  }
}

/**
 * Update the status of a specific support request.
 * @param {string} requestId - The Firestore document ID.
 * @param {string} newStatus - The new status to set (e.g., "resolved").
 */
async function handleStatusUpdate(requestId, newStatus) {
  try {
    const requestRef = doc(db, "supportRequests", requestId);
    await updateDoc(requestRef, { status: newStatus });

    // Optionally update DOM immediately
    const statusEl = document.getElementById(`status-${requestId}`);
    if (statusEl) statusEl.textContent = newStatus;

    alert("Status updated successfully.");
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Error updating status.");
  }
}

// Expose update function globally for inline button handler
window.handleStatusUpdate = handleStatusUpdate;

// Load support requests when DOM is ready
window.addEventListener("DOMContentLoaded", loadSupportRequests);
