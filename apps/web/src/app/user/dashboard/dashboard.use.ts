// app/dashboard/dashboard.use.ts

import { useState, useEffect } from 'react';
import { getAllUsersAction, getUserByIdAction, deleteUserAction } from '@web/app/user/user.service';
import { User } from '@web/app/user/user.interface';
import { useAuth } from '@web/app/auth/AuthContext';
import { Role } from '@web/app/auth/role.interface';
import { ApiException } from '@web/app/common/ApiException';

interface useDashboard {
  users: User[];
  selectedUser: User | null;
  loadingUsers: boolean;
  loadingSelectedUser: boolean;
  error: string;
  showAdmin: boolean;
  loadUserById: (id: string) => void;
  deleteUser: (id: string) => void;
  loadUsers: () => void;
}

export const useDashboard = (): useDashboard => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSelectedUser, setLoadingSelectedUser] = useState(false);
  const [error, setError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const { roles } = useAuth();

  const loadUserById = async (id: string) => {
    setLoadingSelectedUser(true);
    try {
      const user = await getUserByIdAction(id);
      setSelectedUser(user);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      }
    } finally {
      setLoadingSelectedUser(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoadingSelectedUser(true);
    try {
      await deleteUserAction(id);
      setUsers(users.filter((user) => user.id !== id));
      setSelectedUser(null);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      }
    } finally {
      setLoadingSelectedUser(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    setLoadingSelectedUser(true);
    try {
      const users = await getAllUsersAction();
      setUsers(users);
      const user = users.find((user) => user.id === selectedUser?.id);
      setSelectedUser(user || null);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      }
    } finally {
      setLoadingUsers(false);
      setLoadingSelectedUser(false);
    }
  };

  useEffect(() => {
    if (roles) {
      setShowAdmin(roles.includes(Role.ADMIN));
    }
  }, [roles]);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    selectedUser,
    loadingUsers,
    loadingSelectedUser,
    error,
    showAdmin,
    loadUserById,
    deleteUser,
    loadUsers,
  };
};
