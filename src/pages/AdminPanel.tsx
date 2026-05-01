import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Settings, Shield, ChevronLeft, 
  Search, ExternalLink, Trash2, Edit, Save, Bell, Plus, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, query, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

export const AdminPanel: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'notifications'>('users');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [notificationsContent, setNotificationsContent] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState({
    facebookPage: 'https://www.facebook.com/share/188NYWqk6w/',
    facebookGroup: 'https://www.facebook.com/share/g/1LEXoM7A3b/',
    version: '1.0'
  });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newContent, setNewContent] = useState({ text_bn: '', text_en: '', type: 'fact' as 'fact' | 'motivation' });

  const saveSettings = async () => {
    const path = 'config/global';
    try {
      await setDoc(doc(db, 'config', 'global'), appSettings);
      alert('Settings saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const addContent = async () => {
    if (!newContent.text_bn || !newContent.text_en) return;
    const path = 'notifications_content';
    try {
      const { addDoc } = await import('firebase/firestore');
      if (editingItem) {
        await updateDoc(doc(db, path, editingItem.id), newContent);
        setEditingItem(null);
      } else {
        await addDoc(collection(db, path), newContent);
      }
      setShowAddForm(false);
      setNewContent({ text_bn: '', text_en: '', type: 'fact' });
      // Refresh list
      const q = query(collection(db, path));
      const querySnapshot = await getDocs(q);
      setNotificationsContent(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteContent = async (id: string) => {
    const path = `notifications_content/${id}`;
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'notifications_content', id));
      setNotificationsContent(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

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

    const fetchNotifications = async () => {
      const path = 'notifications_content';
      try {
        const q = query(collection(db, path));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotificationsContent(fetched);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    };

    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'config', 'global'));
        if (snap.exists()) {
          setAppSettings(snap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchUsers();
    fetchNotifications();
    fetchSettings();
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
          Config
        </button>
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'notifications' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500'}`}
        >
          <Bell size={20} />
          Alerts
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
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
                    onChange={(e) => setAppSettings(prev => ({ ...prev, facebookPage: e.target.value }))}
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Facebook Group</label>
                  <input 
                    type="text" 
                    value={appSettings.facebookGroup}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, facebookGroup: e.target.value }))}
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">App Version</label>
                  <input 
                    type="text" 
                    value={appSettings.version}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-1"
                  />
                </div>
                
                <button 
                  onClick={saveSettings}
                  className="w-full p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">Dynamic Content</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-primary text-white p-2 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg shadow-primary/20"
                >
                   <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add Content'}
                </button>
             </div>

             {showAddForm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 mb-4"
                >
                   <h4 className="font-bold text-gray-800 text-sm">Add New Fact or Quote</h4>
                   <div className="space-y-3">
                      <select 
                        value={newContent.type}
                        onChange={(e) => setNewContent({...newContent, type: e.target.value as any})}
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm"
                      >
                        <option value="fact">Islamic Fact</option>
                        <option value="motivation">Motivational Quote</option>
                      </select>
                      <textarea 
                        placeholder="Text in Bengali"
                        value={newContent.text_bn}
                        onChange={(e) => setNewContent({...newContent, text_bn: e.target.value})}
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm h-20"
                      />
                      <textarea 
                        placeholder="Text in English"
                        value={newContent.text_en}
                        onChange={(e) => setNewContent({...newContent, text_en: e.target.value})}
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm h-20"
                      />
                      <button 
                        onClick={addContent}
                        className="w-full p-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                      >
                        Add to List
                      </button>
                   </div>
                </motion.div>
             )}

             <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                {notificationsContent.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    <p>No custom notification content found.</p>
                    <p className="text-[10px]">Static content will be used instead.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notificationsContent.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'fact' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'}`}>
                          {item.type === 'fact' ? <Shield size={20} /> : <Star size={20} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm truncate">{item.text_bn}</h4>
                          <p className="text-[10px] text-gray-400 truncate">{item.text_en}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingItem(item);
                              setNewContent({ text_bn: item.text_bn, text_en: item.text_en, type: item.type });
                              setShowAddForm(true);
                            }}
                            className="p-2 text-gray-300 hover:text-primary transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deleteContent(item.id)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
