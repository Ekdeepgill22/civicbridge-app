// firebaseTest.js
import { getApp, getApps } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

try {
  const apps = getApps();
  console.log("📦 Existing Firebase apps:", apps.map(app => app.name));

  // Attempt to get the default Firebase app
  const app = getApp();
  console.log("🔥 Firebase App initialized:", app.name);

  // Test Auth & Firestore instances
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("✅ Auth instance found:", !!auth);
  console.log("✅ Firestore instance found:", !!db);
  console.log("🎉 Firebase is successfully initialized!");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}
