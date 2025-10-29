// Import the functions you need from the SDKs you need
// import { getApps, initializeApp } from "@react-native-firebase/app";
import { getApp, getApps, initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYw4Cg_X5q8tJ4Q80cm6g9s7BRLiVH5Js",
  authDomain: "civicbridge.firebaseapp.com",
  projectId: "civicbridge",
  storageBucket: "civicbridge.firebasestorage.app",
  messagingSenderId: "963546796043",
  appId: "1:963546796043:web:2a0425627d25821fa5f70e"
};

// // Initialize Firebase
if (getApps().length === 0) {
  // When using react-native-firebase the native side provides config; cast to any to satisfy TS
  initializeApp(firebaseConfig);
}

const app = getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
// export default firebaseConfig;
