import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const siteName = document.getElementById("siteName");
const developerName = document.getElementById("developerName");
const logoUrl = document.getElementById("logoUrl");
const footerText = document.getElementById("footerText");
const status = document.getElementById("status");

async function loadSettings() {

  try {

    const ref = doc(db, "settings", "website");
    const snap = await getDoc(ref);

    if (snap.exists()) {

      const data = snap.data();

      siteName.value = data.siteName || "";
      developerName.value = data.developerName || "";
      logoUrl.value = data.logoUrl || "";
      footerText.value = data.footerText || "";

    }

  } catch (e) {

    status.innerHTML = e.message;
    status.style.color = "red";

  }

}

window.saveSettings = async function () {

  try {

    await setDoc(doc(db, "settings", "website"), {

      siteName: siteName.value.trim(),
      developerName: developerName.value.trim(),
      logoUrl: logoUrl.value.trim(),
      footerText: footerText.value.trim(),
      updatedAt: new Date().toISOString()

    });

    status.innerHTML = "✅ Settings saved successfully";
    status.style.color = "green";

  } catch (e) {

    status.innerHTML = e.message;
    status.style.color = "red";

  }

};

loadSettings();
