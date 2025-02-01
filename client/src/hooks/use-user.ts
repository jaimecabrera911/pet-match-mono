import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Mock user type
interface User {
  id: number;
  username: string;
  role: string;
}

// Mock authentication data type
interface AuthData {
  username: string;
  password: string;
}

const STORAGE_KEY = 'pet_adoption_auth';

// Mock user database
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' },
];

// Mock authentication functions
async function mockAuth(data: AuthData): Promise<{ ok: boolean; message?: string; user?: User }> {
  const user = mockUsers.find(u => u.username === data.username && u.password === data.password);

  if (!user) {
    return { ok: false, message: 'Credenciales inválidas' };
  }

  const { password, ...userWithoutPassword } = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
  return { ok: true, user: userWithoutPassword };
}

async function mockRegister(data: AuthData): Promise<{ ok: boolean; message?: string; user?: User }> {
  const existingUser = mockUsers.find(u => u.username === data.username);

  if (existingUser) {
    return { ok: false, message: 'El usuario ya existe' };
  }

  const newUser = {
    id: mockUsers.length + 1,
    username: data.username,
    password: data.password,
    role: 'user'
  };

  mockUsers.push(newUser);
  const { password, ...userWithoutPassword } = newUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
  return { ok: true, user: userWithoutPassword };
}

async function mockLogout(): Promise<{ ok: boolean }> {
  localStorage.removeItem(STORAGE_KEY);
  return { ok: true };
}

async function getCurrentUser(): Promise<User | null> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export function useUser() {
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (userData: AuthData) => mockAuth(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: mockLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: AuthData) => mockRegister(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
  };
}