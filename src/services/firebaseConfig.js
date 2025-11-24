import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCu-_d7IXVLVugdgOasQlMO4dH7Z9fIKec",
  authDomain: "projetoremedio.firebaseapp.com",
  projectId: "projetoremedio",
  storageBucket: "projetoremedio.appspot.com",
  messagingSenderId: "28389929207",
  appId: "1:28389929207:web:6482a83c8eca5d0f3ae3f2",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
