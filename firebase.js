import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDZB4hJeVRgEvPqE51lgqFEFLRIFLoeaA",
  authDomain: "domino-88969.firebaseapp.com",
  databaseURL: "https://domino-88969-default-rtdb.firebaseio.com",
  projectId: "domino-88969",
  storageBucket: "domino-88969.firebasestorage.app",
  messagingSenderId: "509182859469",
  appId: "1:509182859469:web:aa464212f40624d726f184",
  measurementId: "G-0Z50D58FWJ"
};

// init ONCE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
