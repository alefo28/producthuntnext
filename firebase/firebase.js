// import app from 'firebase/app'; // Firebase 9
import { initializeApp } from "firebase/app"; // compatibilidad en firebase9
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./config";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

class Firebase {
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  // Registrar un usuario.
  async registrar(nombre, email, password) {
    const nuevoUsuario = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    // Utilizar updateProfile desde el módulo auth para establecer el displayName
    await updateProfile(this.auth.currentUser, { displayName: nombre });

    return nuevoUsuario;
  }

  //Inicia sesio Del usuario
  async login(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  //Cerrar Sesion del usuario
  async cerrarSesion() {
    await signOut(this.auth);
  }

  //Método para subir el archivo al storage y obtener la URL de la imagen (eso retorna este método, la URL de la imagen)
  async subirFotoAFBStorage(file) {
    const storageRef = ref(this.storage, "productos/" + file.name);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}

const firebase = new Firebase();
export default firebase;
