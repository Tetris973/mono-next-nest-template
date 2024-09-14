import { useState, useEffect } from 'react';
import {
  getAllUsersAction as defaultGetAllUsersAction,
  getUserByIdAction as defaultGetUserByIdAction,
  deleteUserAction as defaultDeleteUserAction,
} from '@web/app/user/user.service';
import { UserDto } from '@web/lib/backend-api/index';
import { useAuth as defaultUseAuth, AuthContextInterface } from '@web/app/auth/AuthContext';
import { Role } from '@web/app/auth/role.enum';
import { useServerAction } from '@web/common/helpers/server-action.hook';
import { useServerActionSWR } from '@web/common/helpers/server-action-swr.hook';

export interface useDashboard {
  users: UserDto[] | undefined;
  selectedUser: UserDto | null;
  getAllUsersPending: boolean;
  getUserByIdPending: boolean;
  error: string;
  showAdmin: boolean;
  loadUserById: (id: number) => Promise<string | void>;
  deleteUser: (id: number) => Promise<string | void>;
  loadUsers: () => Promise<void>;
}

export interface UseDashboardDependencies {
  useAuth?: () => AuthContextInterface;
  getAllUsersAction?: typeof defaultGetAllUsersAction;
  getUserByIdAction?: typeof defaultGetUserByIdAction;
  deleteUserAction?: typeof defaultDeleteUserAction;
}

export const useDashboard = ({
  getAllUsersAction = defaultGetAllUsersAction,
  getUserByIdAction = defaultGetUserByIdAction,
  deleteUserAction = defaultDeleteUserAction,
  useAuth = defaultUseAuth,
}: UseDashboardDependencies = {}): useDashboard => {
  const [getUserByIdPending, getUserByIdActionM] = useServerAction(getUserByIdAction);
  const [, deleteUserActionM] = useServerAction(deleteUserAction);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [error, setError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const { roles } = useAuth();

  const {
    data: users,
    error: usersError,
    mutate: mutateUsers,
    isLoading: getAllUsersPending,
  } = useServerActionSWR('getAllUsers', getAllUsersAction);

  useEffect(() => {
    if (roles) {
      setShowAdmin(roles.includes(Role.ADMIN));
    }
  }, [roles]);

  useEffect(() => {
    if (usersError) {
      setError(usersError.message);
    }
  }, [usersError]);

  const loadUsers = async () => {
    const users = await mutateUsers();
    setSelectedUser(users?.find((user) => user.id === selectedUser?.id) || null);
  };

  const loadUserById = async (id: number) => {
    const { data, error } = await getUserByIdActionM(id);
    if (error) {
      setError(error.message);
      return error.message;
    }
    setSelectedUser(data);
  };

  const deleteUser = async (id: number) => {
    const { error } = await deleteUserActionM(id);
    if (error) {
      setError(error.message);
      return error.message;
    }
    mutateUsers(users?.filter((user) => user.id !== id));
    setSelectedUser(null);
  };

  return {
    users,
    selectedUser,
    getAllUsersPending,
    getUserByIdPending,
    error,
    showAdmin,
    loadUserById,
    deleteUser,
    loadUsers,
  };
};
