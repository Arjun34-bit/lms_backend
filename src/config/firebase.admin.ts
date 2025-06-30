// src/config/firebase.admin.ts

import * as admin from 'firebase-admin';
import serviceAccount from './firebaseServiceAccountKey.json';

 // Keep using the existing file
import { ServiceAccount } from 'firebase-admin';

const firebaseAdminConfig: ServiceAccount = serviceAccount as ServiceAccount;

// Initialize only if not already initialized (important for hot-reload / testing)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

export const firebaseAuth = admin.auth();
export const firebaseAdminApp = admin.app();
