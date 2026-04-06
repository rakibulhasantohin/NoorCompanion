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
      let errorMessage = isBn ? 'গুগল লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Google login failed. Please try again.';
      
      if (err.code === 'auth/popup-blocked') {
        errorMessage = isBn ? 'আপনার ব্রাউজার পপ-আপ ব্লক করেছে। দয়া করে পপ-আপ এলাউ করুন এবং আবার চেষ্টা করুন।' : 'Browser blocked the popup. Please allow popups for this site and try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = isBn ? 'লগইন উইন্ডোটি বন্ধ করা হয়েছে। দয়া করে আবার চেষ্টা করুন।' : 'Login window was closed. Please try again.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = isBn ? 'এই ডোমেইনটি অথরাইজড নয়। ফায়ারবেস কনসোলে এই ডোমেইনটি যোগ করতে হবে।' : 'This domain is not authorized. Please add this domain to Firebase Console Authorized Domains.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = isBn ? 'নেটওয়ার্ক সমস্যা। আপনার ইন্টারনেট কানেকশন চেক করুন।' : 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = isBn ? `লগইন ব্যর্থ হয়েছে: ${err.code || err.message}` : `Login failed: ${err.code || err.message}`;
      }
      
      setError(errorMessage);
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
                  className="bg-rose-50 text-rose-500 p-4 rounded-2xl text-xs font-bold mb-6 text-center border border-rose-100 relative group"
                >
                  {error}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(error);
                      alert(isBn ? 'এরর কপি করা হয়েছে' : 'Error copied to clipboard');
                    }}
                    className="block mt-2 text-[10px] underline opacity-60 hover:opacity-100 mx-auto"
                  >
                    {isBn ? 'এরর কপি করুন' : 'Copy Error'}
                  </button>
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
