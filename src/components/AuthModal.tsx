import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, X, LogIn, UserPlus } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { state } = useAppState();
  const isBn = state.language === 'bn';
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(isBn ? 'সব তথ্য পূরণ করুন' : 'Please fill all fields');
      return;
    }

    const usersStr = localStorage.getItem('noor_users') || '{}';
    const users = JSON.parse(usersStr);

    if (isLogin) {
      if (users[email] && users[email].password === password) {
        // Success
        localStorage.setItem('noor_current_user', email);
        window.dispatchEvent(new Event('auth_changed'));
        onClose();
      } else {
        setError(isBn ? 'ইমেইল বা পাসওয়ার্ড ভুল' : 'Invalid email or password');
      }
    } else {
      if (users[email]) {
        setError(isBn ? 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত' : 'Email already in use');
      } else {
        // Register
        users[email] = { password, photo: null };
        localStorage.setItem('noor_users', JSON.stringify(users));
        localStorage.setItem('noor_current_user', email);
        window.dispatchEvent(new Event('auth_changed'));
        onClose();
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
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="p-6 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6 mt-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isLogin ? (isBn ? 'লগইন করুন' : 'Login') : (isBn ? 'রেজিস্ট্রেশন করুন' : 'Register')}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {isLogin 
                    ? (isBn ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'Access your account')
                    : (isBn ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create a new account')}
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-500 p-3 rounded-xl text-sm mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isBn ? 'ইমেইল' : 'Email'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="example@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isBn ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3 rounded-xl font-bold text-lg mt-2"
                >
                  {isLogin ? (isBn ? 'লগইন' : 'Login') : (isBn ? 'রেজিস্টার' : 'Register')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-primary text-sm font-medium hover:underline"
                >
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
