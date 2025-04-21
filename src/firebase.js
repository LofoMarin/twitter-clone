import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCqiy2sCLKD7DDoULB_GjcnEe3CLxFlx78",
  authDomain: "parcial-2-frontend.firebaseapp.com",
  projectId: "parcial-2-frontend",
  storageBucket: "parcial-2-frontend.firebasestorage.app",
  messagingSenderId: "15401666964",
  appId: "1:15401666964:web:43a06cbd27e6ecf69e2781",
  measurementId: "G-XC2DF70P87",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
export default app
