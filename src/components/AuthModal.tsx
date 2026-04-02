import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, X, LogIn, UserPlus, Phone, User, Calendar, Chrome } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { cn } from '../utils/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { state, updateState } = useAppState();
  const isBn = state.language === 'bn';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      // Add scope for Google Drive app data
      provider.addScope('https://www.googleapis.com/auth/drive.appdata');
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (token) {
        localStorage.setItem(`google_drive_token_${user.uid}`, token);
      }

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      const userData = {
        uid: user.uid,
        fullName: user.displayName || 'User',
        profileImage: user.photoURL || null,
        email: user.email,
        lastLogin: new Date().toISOString()
      };

      if (!userDoc.exists()) {
        // Create new user record
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          createdAt: new Date().toISOString()
        });
      } else {
        // Update existing user record with latest Google info if needed
        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      }

      // Update local app state
      updateState({
        fullName: user.displayName,
        profileImage: user.photoURL
      });

      onClose();
    } catch (err: any) {
      console.error('Google Login Error:', err);
      setError(isBn ? 'গুগল লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="p-8 relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary shadow-inner">
                  <LogIn size={36} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isBn ? 'লগইন করুন' : 'Login'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isBn ? 'আপনার গুগল অ্যাকাউন্ট দিয়ে খুব সহজেই লগইন করুন' : 'Login easily with your Google account'}
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-xs font-bold mb-6 text-center border border-rose-100"
                >
                  {error}
                </motion.div>
              )}

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span>{isBn ? 'গুগল দিয়ে লগইন' : 'Login with Google'}</span>
              </button>

              <div className="mt-8 text-center text-xs text-gray-400">
                {isBn ? 'লগইন করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন' : 'By logging in, you agree to our terms and conditions'}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
