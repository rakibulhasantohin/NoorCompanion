import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Settings, Shield, ChevronLeft, 
  Search, ExternalLink, Trash2, Edit, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

export const AdminPanel: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState({
    facebookPage: 'https://www.facebook.com/share/188NYWqk6w/',
    facebookGroup: 'https://www.facebook.com/share/g/1LEXoM7A3b/',
    version: '1.0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/settings');
      return;
    }

    const fetchUsers = async () => {
      const usersPath = 'users';
      try {
        const q = query(collection(db, usersPath));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsersList(fetchedUsers);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, usersPath);
      }
    };

    fetchUsers();
    setLoading(false);
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-primary text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-white/70">Welcome, {user?.displayName || 'Admin'}</p>
          </div>
        </div>
      </header>

      <div className="p-4 flex gap-2">
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500'}`}
        >
          <Users size={20} />
          Users
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500'}`}
        >
          <Settings size={20} />
          App Config
        </button>
      </div>

      <div className="px-4">
        {activeTab === 'users' ? (
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full p-4 bg-white rounded-2xl shadow-sm pl-12 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              {usersList.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <p>No registered users found in Firestore.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {usersList.map((usr) => (
                    <div key={usr.id} className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {usr.profileImage ? (
                          <img src={usr.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Shield className="text-gray-300" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{usr.fullName || 'Unnamed User'}</h4>
                        <p className="text-xs text-gray-500">{usr.email}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-primary">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Global App Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Facebook Page</label>
                  <input 
                    type="text" 
                    value={appSettings.facebookPage}
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Facebook Group</label>
                  <input 
                    type="text" 
                    value={appSettings.facebookGroup}
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">App Version</label>
                  <input 
                    type="text" 
                    value={appSettings.version}
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-1"
                  />
                </div>
                
                <button className="w-full p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-red-500 flex items-center gap-2 mb-4">
                <Trash2 size={20} />
                Danger Zone
              </h3>
              <p className="text-xs text-gray-500 mb-4">These actions are permanent and cannot be undone.</p>
              <button className="w-full p-4 border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50">
                Reset All Users
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
