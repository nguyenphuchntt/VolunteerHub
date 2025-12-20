// Firebase configuration for VolunteerHub
// TODO: Replace with your actual Firebase Web config from Firebase Console
// Go to: https://console.firebase.google.com/project/volunteerhub-af843/settings/general
// Then scroll to "Your apps" section and copy the config

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "volunteerhub-af843.firebaseapp.com",
    projectId: "volunteerhub-af843",
    storageBucket: "volunteerhub-af843.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// VAPID Key for Web Push notifications
// Go to: Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
// Generate key pair if not exists, then copy the "Key pair" value
export const VAPID_KEY = "YOUR_VAPID_KEY";

export default firebaseConfig;
