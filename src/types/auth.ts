export interface User {
  id: string;
  email: string;
  fullName: string;
  lineId: string;
  role: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, fullName: string, lineId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: User['status']) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUsers: () => Promise<User[]>;
}