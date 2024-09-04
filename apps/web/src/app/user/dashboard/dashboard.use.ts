import { useState, useEffect } from 'react';
import {
  getAllUsersAction as defaultGetAllUsersAction,
  getUserByIdAction as defaultGetUserByIdAction,
  deleteUserAction as defaultDeleteUserAction,
} from '@web/app/user/user.service';
import { UserDto } from '@dto/modules/user/dto/user.dto';
import { useAuth as defaultUseAuth, AuthContextInterface } from '@web/app/auth/AuthContext';
import { Role } from '@web/app/auth/role.enum';
import { useServerAction } from '@web/common/helpers/server-action.use';

export interface useDashboard {
  users: UserDto[];
  selectedUser: UserDto | null;
  getAllUsersPending: boolean;
  getUserByIdPending: boolean;
  error: string;
  showAdmin: boolean;
  loadUserById: (id: number) => Promise<string | void>;
  deleteUser: (id: number) => Promise<string | void>;
  loadUsers: () => Promise<string | void>;
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
  const [getAllUsersPending, getAllUsersActionM] = useServerAction(getAllUsersAction);
  const [getUserByIdPending, getUserByIdActionM] = useServerAction(getUserByIdAction);
  const [, deleteUserActionM] = useServerAction(deleteUserAction);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [error, setError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const { roles } = useAuth();

  /**
   * Load a user by id
   * @param id - The id of the user to load
   * @returns The error message if there is an error, otherwise undefined
   */
  const loadUserById = async (id: number) => {
    const { data, error } = await getUserByIdActionM(id);
    if (error) {
      setError(error.message);
      return error.message;
    }
    setSelectedUser(data);
  };

  /**
   * Delete a user
   * @param id - The id of the user to delete
   * @returns The error message if there is an error, otherwise undefined
   */
  const deleteUser = async (id: number) => {
    const { error } = await deleteUserActionM(id);
    if (error) {
      setError(error.message);
      return error.message;
    }
    setUsers(users.filter((user) => user.id !== id));
    setSelectedUser(null);
  };

  /**
   * Load all users
   * @returns The error message if there is an error, otherwise undefined
   */
  const loadUsers = async () => {
    const { data, error } = await getAllUsersActionM();
    if (error) {
      setError(error.message);
      return error.message;
    }
    setUsers(data);
    const user = data.find((user) => user.id === selectedUser?.id);
    setSelectedUser(user || null);
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
    getAllUsersPending,
    getUserByIdPending,
    error,
    showAdmin,
    loadUserById,
    deleteUser,
    loadUsers,
  };
};
