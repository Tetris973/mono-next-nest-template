import React, { createContext, useState, useContext, useEffect } from 'react';
import { updateProfileAction, getProfileAction } from '@web/app/auth/profile/profile.service';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  user: { id: string; username: string; createdAt: string; updatedAt: string } | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  updateProfile: (newUsername: string) => Promise<ActionErrorResponse | void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; username: string; createdAt: string; updatedAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchUser = async () => {
    setLoading(true);
    const data = await getProfileAction();
    if ('status' in data) {
      setUser(null);
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  const updateProfile = async (newUsername: string) => {
    if (!user) return;
    const updateResponse = await updateProfileAction(newUsername);
    if ('status' in updateResponse) {
      return updateResponse;
    }
    setUser(updateResponse);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  return (
    <ProfileContext.Provider value={{ user, loading, fetchUser, updateProfile }}>{children}</ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
