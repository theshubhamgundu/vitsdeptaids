import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileCompletion from './ProfileCompletion';

interface ProfileWrapperProps {
  children: React.ReactNode;
}

const ProfileWrapper: React.FC<ProfileWrapperProps> = ({ children }) => {
  const { user, updateUser } = useAuth();

  if (!user) return null;

  // Check if user needs to complete their profile
  const needsProfileCompletion = !user.profileCompleted;

  if (needsProfileCompletion) {
    return (
      <ProfileCompletion
        onComplete={() => {
          updateUser({
            profileCompleted: true
          });
        }}
      />
    );
  }

  return <>{children}</>;
};

export default ProfileWrapper;
