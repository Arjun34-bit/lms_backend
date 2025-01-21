import { initializeApp } from "firebase/app";
const admin = require("firebase-admin");

const firebaseConfig = {
  apiKey: "AIzaSyAqnd9TbVZ4S8Nh-eKYhevdoBmVnrUFGEw",
  authDomain: "perfectcoachingcenter-45af1.firebaseapp.com",
  projectId: "perfectcoachingcenter-45af1",
  storageBucket: "perfectcoachingcenter-45af1.firebasestorage.app",
  messagingSenderId: "822371254547",
  appId: "1:822371254547:web:30560a2f408dde939f5ae6",
  measurementId: "G-TJMYE28V4V"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});