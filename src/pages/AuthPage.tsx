import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, ChevronLeft, ArrowRight, 
  AlertCircle, ShieldCheck, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  auth, 
  db,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithGoogle,
  sendPasswordResetEmail
} from '../lib/firebase';
import { useAppState } from '../hooks/useAppState';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppState();
  const isBn = state.language === 'bn';
  
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/settings');
      } else if (authMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password should be at least 6 characters');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });
        navigate('/settings');
      } else if (authMode === 'forgot') {
        // 1. Verify if name matches in Firestore
        const { collection, query, where, getDocs, limit } = await import('firebase/firestore');
        
        const q = query(
          collection(db, 'users'), 
          where('email', '==', formData.email),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error(isBn 
            ? 'এই ইমেইলটি আমাদের রেকর্ডে নেই' 
            : 'Email not found in our records');
        }

        const userData = querySnapshot.docs[0].data();
        if (userData.fullName !== formData.name) {
          throw new Error(isBn 
            ? 'নামের তথ্যটি ভুল। নিবন্ধিত নামটি লিখুন' 
            : 'The name does not match our records');
        }

        // 2. Send Reset Email (Standard Secure Way)
        await sendPasswordResetEmail(auth, formData.email);
        
        setSuccess(isBn 
          ? 'তথ্য যাচাই করা হয়েছে এবং পাসওয়ার্ড রিসেট করার একটি লিংক আপনার ইমেইলে পাঠানো হয়েছে।' 
          : 'Identity verified. A password reset link has been sent to your email.');
      }
    } catch (err: any) {
      console.error(err);
      let message = err.message;
      if (err.code === 'auth/email-already-in-use') {
        message = isBn ? 'এই ইমেইলটি ইতিপূর্বে ব্যবহার করা হয়েছে' : 'This email is already in use';
      } else if (err.code === 'auth/invalid-email') {
        message = isBn ? 'ভুল ইমেইল ফরম্যাট' : 'Invalid email format';
      } else if (err.code === 'auth/user-not-found') {
        message = isBn ? 'ইউজার খুঁজে পাওয়া যায়নি' : 'User not found';
      } else if (err.code === 'auth/wrong-password') {
        message = isBn ? 'ভুল পাসওয়ার্ড' : 'Wrong password';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/settings');
    } catch (err) {
      console.error(err);
      setError(isBn ? 'গুগল লগইন ব্যর্থ হয়েছে' : 'Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-primary text-white p-6 rounded-b-[2.5rem] shadow-lg sticky top-0 z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 relative z-10"
        >
          <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {authMode === 'login' 
                ? (isBn ? 'লগইন করুন' : 'Sign In') 
                : authMode === 'signup' 
                ? (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')
                : (isBn ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password')}
            </h1>
            <p className="text-xs text-white/70">
              {authMode === 'forgot' 
                ? (isBn ? 'আপনার তথ্য যাচাই করুন' : 'Verify your information')
                : (isBn ? 'নূর কম্প্যানিয়ন-এ স্বাগতম' : 'Welcome to Noor Companion')}
            </p>
          </div>
        </motion.div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20px] left-[10%] w-20 h-20 bg-white/5 rounded-full blur-xl" />
      </header>

      <div className="max-w-md mx-auto p-6 space-y-6">
        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {(authMode === 'signup' || authMode === 'forgot') && (
              <motion.div 
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  {authMode === 'signup' ? (isBn ? 'পুরো নাম' : 'Full Name') : (isBn ? 'নিবন্ধিত নাম' : 'Registered Name')}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    required={(authMode === 'signup' || authMode === 'forgot')}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={isBn ? 'আপনার নাম লিখুন' : 'Enter your name'}
                    className="w-full p-4 bg-white rounded-2xl border border-gray-100 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
              {isBn ? 'ইমেইল এড্রেস' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder={isBn ? 'আপনার ইমেইল দিন' : 'Enter your email'}
                className="w-full p-4 bg-white rounded-2xl border border-gray-100 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {authMode !== 'forgot' && (
              <motion.div 
                key="password-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    {isBn ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  {authMode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-[10px] font-bold text-primary hover:underline uppercase"
                    >
                      {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password"
                    required={authMode !== 'forgot'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={isBn ? 'পাসওয়ার্ড দিন' : 'Enter password'}
                    className="w-full p-4 bg-white rounded-2xl border border-gray-100 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {authMode === 'signup' && (
              <motion.div 
                key="confirm-password"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password"
                    required={authMode === 'signup'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder={isBn ? 'আবার পাসওয়ার্ড দিন' : 'Rewrite password'}
                    className="w-full p-4 bg-white rounded-2xl border border-gray-100 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold border border-emerald-100 leading-relaxed"
              >
                <ShieldCheck size={18} className="shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {authMode === 'login' 
                  ? (isBn ? 'লগইন' : 'Login') 
                  : authMode === 'signup' 
                  ? (isBn ? 'নিবন্ধন করুন' : 'Sign Up')
                  : (isBn ? 'তথ্য যাচাই করুন' : 'Verify Info')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-[1px] bg-gray-200" />
          <span className="text-xs font-bold text-gray-400 uppercase">
            {isBn ? 'অথবা' : 'OR'}
          </span>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full p-4 bg-white text-gray-700 font-bold rounded-2xl border border-gray-100 flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform hover:bg-gray-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
          {isBn ? 'গুগল দিয়ে লগইন' : 'Continue with Google'}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {authMode === 'login' 
              ? (isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?") 
              : authMode === 'signup'
              ? (isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?')
              : (isBn ? 'লগইন-এ ফিরে যান' : 'Back to login')}
            {' '}
            <button 
              onClick={() => {
                if (authMode === 'login') setAuthMode('signup');
                else setAuthMode('login');
                setError(null);
                setSuccess(null);
              }}
              className="text-primary font-bold hover:underline"
            >
              {authMode === 'login' 
                ? (isBn ? 'নতুন তৈরি করুন' : 'Create One') 
                : (isBn ? 'লগইন করুন' : 'Sign In')}
            </button>
          </p>
        </div>

        <div className="pt-6 flex justify-center opacity-30 select-none">
           <ShieldCheck size={40} className="text-primary" />
        </div>
      </div>
    </div>
  );
};
