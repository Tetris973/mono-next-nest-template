import { useState, useEffect } from 'react';
import { getAllUsersAction, getUserByIdAction, deleteUserAction } from '@web/app/user/user.service';
import { UserDto } from '@dto/user/dto/user.dto';
import { useAuth } from '@web/app/auth/AuthContext';
import { Role } from '@web/app/auth/role.interface';

interface useDashboard {
  users: UserDto[];
  selectedUser: UserDto | null;
  loadingUsers: boolean;
  loadingSelectedUser: boolean;
  error: string;
  showAdmin: boolean;
  loadUserById: (id: number) => void;
  deleteUser: (id: number) => void;
  loadUsers: () => void;
}

export const useDashboard = (): useDashboard => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSelectedUser, setLoadingSelectedUser] = useState(false);
  const [error, setError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const { roles } = useAuth();

  const loadUserById = async (id: number) => {
    setLoadingSelectedUser(true);
    const user = await getUserByIdAction(id);
    if ('status' in user) {
      setError(user.message);
    } else {
      setSelectedUser(user);
    }
    setLoadingSelectedUser(false);
  };

  const deleteUser = async (id: number) => {
    setLoadingSelectedUser(true);
    const response = await deleteUserAction(id);
    if (response && 'status' in response) {
      setError(response.message);
    } else {
      setUsers(users.filter((user) => user.id !== id));
      setSelectedUser(null);
    }
    setLoadingSelectedUser(false);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    setLoadingSelectedUser(true);
    const users = await getAllUsersAction();
    if ('status' in users) {
      setError(users.message);
    } else {
      setUsers(users);
      const user = users.find((user) => user.id === selectedUser?.id);
      setSelectedUser(user || null);
    }
    setLoadingUsers(false);
    setLoadingSelectedUser(false);
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
