// src/resource.js
import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// DOM elements
const resourceList = document.getElementById('resourceList');

async function loadResources() {
  try {
    const querySnapshot = await getDocs(collection(db, "resources"));

    if (querySnapshot.empty) {
      resourceList.innerHTML = "<p>No resources available at the moment.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const resourceCard = document.createElement('div');
      resourceCard.classList.add('resource-card');

      resourceCard.innerHTML = `
        <h3>${data.title || "Untitled"}</h3>
        <p><strong>Category:</strong> ${data.category || "General"}</p>
        <p><strong>Type:</strong> ${data.type || "Unknown"}</p>
        ${data.url ? `<a href="${data.url}" target="_blank">View Resource</a>` : ''}
      `;

      resourceList.appendChild(resourceCard);
    });

  } catch (error) {
    console.error("Error fetching resources:", error);
    resourceList.innerHTML = "<p>Error loading resources. Please try again later.</p>";
  }
}

document.addEventListener('DOMContentLoaded', loadResources);
