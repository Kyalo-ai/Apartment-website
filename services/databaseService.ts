
import { User, UserRole } from '../types';

const USERS_KEY = 'luxerent_users';
const SESSION_KEY = 'luxerent_session';

export class DatabaseService {
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      this.users = JSON.parse(stored);
    } else {
      // Default admin for demo
      this.users = [{
        id: 'admin-1',
        name: 'System Admin',
        email: 'admin@luxerent.com',
        password: 'admin',
        role: UserRole.ADMIN
      }];
      this.saveUsers();
    }
  }

  private saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
  }

  signUp(userData: Omit<User, 'id'>): User {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    // If tenant, create a mock tenant record in a real app
    if (newUser.role === UserRole.TENANT) {
      newUser.tenantId = 't-' + newUser.id;
    }

    this.users.push(newUser);
    this.saveUsers();
    this.setSession(newUser);
    return newUser;
  }

  login(email: string, password?: string): User | null {
    const user = this.users.find(u => u.email === email && (!password || u.password === password));
    if (user) {
      this.setSession(user);
      return user;
    }
    return null;
  }

  setSession(user: User) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  getSession(): User | null {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  isEmailAvailable(email: string): boolean {
    return !this.users.some(u => u.email === email);
  }
}

export const dbService = new DatabaseService();
