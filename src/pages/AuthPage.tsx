import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, ChevronLeft, ArrowRight, 
  AlertCircle, ShieldCheck, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithGoogle
} from '../lib/firebase';
import { useAppState } from '../hooks/useAppState';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppState();
  const isBn = state.language === 'bn';
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
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
      }
      navigate('/settings');
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
    } finally {
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
              {isLogin 
                ? (isBn ? 'লগইন করুন' : 'Sign In') 
                : (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
            </h1>
            <p className="text-xs text-white/70">
              {isBn ? 'নূর কম্প্যানিয়ন-এ স্বাগতম' : 'Welcome to Noor Companion'}
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
            {!isLogin && (
              <motion.div 
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  {isBn ? 'পুরো নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    required={!isLogin}
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder={isBn ? 'পাসওয়ার্ড দিন' : 'Enter password'}
                className="w-full p-4 bg-white rounded-2xl border border-gray-100 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>

          <AnimatePresence>
            {!isLogin && (
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
                    required={!isLogin}
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

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? (isBn ? 'লগইন' : 'Login') : (isBn ? 'নিবন্ধন করুন' : 'Sign Up')}
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
            {isLogin 
              ? (isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?") 
              : (isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?')}
            {' '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-primary font-bold hover:underline"
            >
              {isLogin 
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
