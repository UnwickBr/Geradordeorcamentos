import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCPRSVzdMERazzGzEC5l5wBtOeWkiJ2KEA",
  authDomain: "adac-orcamentos.firebaseapp.com",
  projectId: "adac-orcamentos",
  storageBucket: "adac-orcamentos.firebasestorage.app",
  messagingSenderId: "88426956432",
  appId: "1:88426956432:web:cec4911a0e4d7826aaba15"
};

// Log para debug
console.log('🔥 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  currentURL: window.location.origin,
  currentHost: window.location.host
});

// Inicializa o Firebase (verifica se já existe antes)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Firebase Auth
export const auth = getAuth(app);

// Configura o provider do Google
export const googleProvider = new GoogleAuthProvider();

// Configurações do Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account', // Força o usuário a selecionar uma conta
  hd: '*' // Permite qualquer domínio de email
});