import { Injectable } from '@nestjs/common';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth } from '@firebase/auth';
import { getFirestore, doc, setDoc, Firestore } from '@firebase/firestore';

@Injectable()
export class FirebaseService {
  private auth: Auth;
  private db: Firestore;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  async createFirebaseUser(userData: {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string;
    accountType: string;
    cedula: string;
    companyName?: string;
    rif?: string;
  }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password,
      );

      const uid = userCredential.user.uid;

      const firestoreData = {
        email: userData.email,
        user_name: userData.userName,
        display_name: `${userData.firstName} ${userData.lastName}`,
        uid,
        is_pro: false,
        pais: 'Venezuela',
        created_time: new Date(),
        accountType: userData.accountType,
        cedula: userData.cedula,
        companyName: userData.companyName || '',
        rif: userData.rif || '',
        perfil: {
          subtitle_size: '',
          buttons: [],
          imagen: '',
          customFontUrl: '',
          background_color: '#ffffff',
          image_size: 0,
          slides: [],
          background_path: '',
          subtitle: '',
          title_size: 24,
          brandLogo: false,
          text_color: '#000000',
          brandLogoPath: '',
          title: '',
        },
      };

      await setDoc(doc(this.db, 'users', uid), firestoreData);
      return firestoreData;
    } catch (error) {
      console.error('Error creando usuario en Firebase:', error);
      throw error;
    }
  }
}
