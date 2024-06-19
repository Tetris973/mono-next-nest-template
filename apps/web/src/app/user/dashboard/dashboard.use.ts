// app/dashboard/dashboard.use.ts

import { useState, useEffect } from 'react';
import { getAllUsersAction, getUserByIdAction, deleteUserAction } from './dashboard.service';
import { User } from '@web/app/user/user.interface';
import { Role } from '@web/app/auth/role.interface';
import { useAuth } from '@web/app/auth/AuthContext';

export const useDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSelectedUser, setLoadingSelectedUser] = useState(false);
  const [error, setError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const { roles } = useAuth();

  useEffect(() => {
    if (roles) {
      setShowAdmin(roles.includes(Role.ADMIN));
    }
  }, [roles]);

  useEffect(() => {
    setLoadingUsers(true);
    getAllUsersAction()
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingUsers(false);
      });
  }, []);

  const fetchUserById = (id: string) => {
    setLoadingSelectedUser(true);
    getUserByIdAction(id)
      .then((data) => {
        setSelectedUser(data);
        setLoadingSelectedUser(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingSelectedUser(false);
      });
  };

  const deleteUser = async (id: string) => {
    setLoadingSelectedUser(true);
    try {
      await deleteUserAction(id);
      setUsers(users.filter((user) => user.id !== id));
      setSelectedUser(null);
      setLoadingSelectedUser(false);
    } catch (err) {
      setError((err as Error).message);
      setLoadingSelectedUser(false);
    }
  };

  const reloadAfterUpdate = async () => {
    setLoadingUsers(true);
    setLoadingSelectedUser(true);
    try {
      const data = await getAllUsersAction();
      setUsers(data);
      const res = data.find((user) => user.id === selectedUser?.id);
      setSelectedUser(res || null);
      setLoadingUsers(false);
      setLoadingSelectedUser(false);
    } catch (err) {
      setError((err as Error).message);
      setLoadingUsers(false);
    }
  };

  return {
    users,
    selectedUser,
    loadingUsers,
    loadingSelectedUser,
    error,
    showAdmin,
    fetchUserById,
    deleteUser,
    reloadAfterUpdate,
  };
};
