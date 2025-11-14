import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyB_DrTLjiBi7eI8CN4UKEfxpaieZ9MjcfU",
  authDomain: "starwarsapi-be677.firebaseapp.com",
  projectId: "starwarsapi-be677",
  storageBucket: "starwarsapi-be677.firebasestorage.app",
  messagingSenderId: "781447078042",
  appId: "1:781447078042:web:88bf11bea2016d8b633f23"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };