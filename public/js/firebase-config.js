// Firebase Frontend Configuration
// Project: campus-noticeboard-2024eb01570 (LUXE e-commerce)
const firebaseConfig = {
    apiKey: "AIzaSyAuqH4VVgdQycLmVAnzFhnuowuszvB0TbU",
    authDomain: "campus-noticeboard-2024eb01570.firebaseapp.com",
    projectId: "campus-noticeboard-2024eb01570",
    storageBucket: "campus-noticeboard-2024eb01570.firebasestorage.app",
    messagingSenderId: "735769089103",
    appId: "1:735769089103:web:f27ec5b514a3e323eac63a",
    measurementId: "G-PNGLMFZVC9"
};

// Initialize Firebase (compat SDK - works without bundlers)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
