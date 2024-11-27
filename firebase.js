import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "",
    authDomain: "belajarfuncpro.firebaseapp.com",
    projectId: "belajarfuncpro",
    storageBucket: "belajarfuncpro.firebasestorage.app",
    messagingSenderId: "",
    appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc };
