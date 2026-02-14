
export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum ApartmentStatus {
  OCCUPIED = 'OCCUPIED',
  VACANT = 'VACANT',
  MAINTENANCE = 'MAINTENANCE'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  tenantId?: string;
  landlordId?: string;
}

export interface Apartment {
  id: string;
  unitNumber: string;
  floor: number;
  type: string; // e.g., "2BHK", "Studio"
  rentAmount: number;
  status: ApartmentStatus;
  landlordId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartmentId: string;
  leaseStart: string;
  leaseEnd: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  apartmentId: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  description: string;
  createdAt: string;
}

export interface ReminderConfig {
  enabled: boolean;
  sendBeforeDays: number;
  sendAfterDays: number;
  methods: ('EMAIL' | 'SMS')[];
}

export interface SentReminder {
  id: string;
  invoiceId: string;
  tenantName: string;
  sentAt: string;
  method: 'EMAIL' | 'SMS';
  type: 'PRE_DUE' | 'OVERDUE';
}

export interface AppState {
  apartments: Apartment[];
  tenants: Tenant[];
  invoices: Invoice[];
  currentUser: User | null;
  reminderConfig: ReminderConfig;
  reminderLogs: SentReminder[];
}
