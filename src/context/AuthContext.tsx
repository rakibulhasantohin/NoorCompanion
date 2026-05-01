import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = 'rakibulhasantohin@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        setIsAdmin(user?.email === ADMIN_EMAIL);
        
        if (user) {
          // Sync user profile to Firestore
          const userPath = `users/${user.uid}`;
          try {
            await setDoc(doc(db, 'users', user.uid), {
              fullName: user.displayName,
              email: user.email,
              profileImage: user.photoURL,
              lastLogin: serverTimestamp(),
              updatedAt: serverTimestamp()
            }, { merge: true });
          } catch (error) {
            // Log but don't throw to prevent white screen
            console.error("User sync failed:", error);
            // handleFirestoreError(error, OperationType.WRITE, userPath);
          }
        }
      } catch (err) {
        console.error("Auth state change error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
