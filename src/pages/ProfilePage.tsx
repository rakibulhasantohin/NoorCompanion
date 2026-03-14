import React from 'react';
import { AppHeader } from '../components/Common';
import { ProfileSection } from '../components/Profile';
import { useTranslation } from '../hooks/useTranslation';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title={t('profile')} showBack />
      <div className="px-4 py-4">
        <ProfileSection />
      </div>
    </div>
  );
};
