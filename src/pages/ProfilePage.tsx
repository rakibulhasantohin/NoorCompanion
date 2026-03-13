import React from 'react';
import { AppHeader } from '../components/Common';
import { ProfileSection } from '../components/Profile';
import { useAppState } from '../hooks/useAppState';

export const ProfilePage: React.FC = () => {
  const { state } = useAppState();
  const isBn = state.language === 'bn';

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title={isBn ? 'প্রোফাইল' : 'Profile'} showBack />
      <div className="px-4 py-6">
        <ProfileSection />
      </div>
    </div>
  );
};
