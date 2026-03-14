import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, X, LogIn, UserPlus, Phone, User, Calendar } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { cn } from '../utils/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { state } = useAppState();
  const isBn = state.language === 'bn';
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let authEmail = email;
      if (authMethod === 'phone') {
        if (!phoneNumber.startsWith('01') || phoneNumber.length !== 11) {
          setError(isBn ? 'সঠিক বাংলাদেশি মোবাইল নাম্বার দিন' : 'Enter a valid Bangladeshi phone number');
          return;
        }
        authEmail = `${phoneNumber}@noor.com`;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, authEmail, password);
        onClose();
      } else {
        // Registration
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          fullName,
          dateOfBirth: dateOfBirth || null,
          email: authMethod === 'email' ? email : null,
          phoneNumber: authMethod === 'phone' ? phoneNumber : null,
          createdAt: new Date().toISOString()
        });
        onClose();
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(isBn ? 'ভুল ইমেইল/ফোন অথবা পাসওয়ার্ড' : 'Invalid email/phone or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError(isBn ? 'এই ইমেইল/ফোন দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে' : 'Email/Phone already in use');
      } else {
        setError(err.message);
      }
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
                  {isLogin ? <LogIn size={36} /> : <UserPlus size={36} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isLogin ? (isBn ? 'লগইন করুন' : 'Login') : (isBn ? 'রেজিস্ট্রেশন করুন' : 'Register')}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isLogin 
                    ? (isBn ? 'আপনার অ্যাকাউন্টে ফিরে যান' : 'Welcome back to your account')
                    : (isBn ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create a new account to get started')}
                </p>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
                <button 
                  onClick={() => setAuthMethod('email')}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                    authMethod === 'email' ? "bg-white text-primary shadow-sm" : "text-gray-500"
                  )}
                >
                  {isBn ? 'ইমেইল' : 'Email'}
                </button>
                <button 
                  onClick={() => setAuthMethod('phone')}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                    authMethod === 'phone' ? "bg-white text-primary shadow-sm" : "text-gray-500"
                  )}
                >
                  {isBn ? 'ফোন' : 'Phone'}
                </button>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder={isBn ? 'পুরো নাম' : 'Full Name'} required />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" required />
                    </div>
                  </>
                )}

                {authMethod === 'phone' ? (
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder={isBn ? 'মোবাইল নাম্বার (০১...)' : 'Phone Number (01...)'} required />
                  </div>
                ) : (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder={isBn ? 'ইমেইল এড্রেস' : 'Email Address'} required />
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder={isBn ? 'পাসওয়ার্ড' : 'Password'} required />
                </div>

                <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg mt-4 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  {isLogin ? (isBn ? 'লগইন' : 'Login') : (isBn ? 'রেজিস্টার' : 'Register')}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-gray-500 text-sm font-medium hover:text-primary transition-colors">
                  {isLogin 
                    ? (isBn ? 'অ্যাকাউন্ট নেই? নতুন তৈরি করুন' : 'No account? Create one')
                    : (isBn ? 'অ্যাকাউন্ট আছে? লগইন করুন' : 'Have an account? Login')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
