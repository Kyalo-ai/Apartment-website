
import { ApartmentStatus, PaymentStatus, Apartment, Tenant, Invoice } from './types';

export const SUPPORT_CONTACT = "0759208088";

export const AMENITIES = [
  { name: "Swimming Pool", icon: "🏊‍♂️", description: "Heated infinity pool on the rooftop." },
  { name: "Fitness Center", icon: "🏋️‍♀️", description: "24/7 access to state-of-the-art gym equipment." },
  { name: "Dedicated Parking", icon: "🚗", description: "Secure basement parking with EV charging spots." },
  { name: "High-Speed Wi-Fi", icon: "📶", description: "Fiber optic connection in all common areas." },
  { name: "24/7 Security", icon: "🛡️", description: "CCTV surveillance and professional guards." },
  { name: "Rooftop Lounge", icon: "🌆", description: "Entertainment area with BBQ grills and city views." },
];

export const SAMPLE_LEASE_DOC = `
RESIDENTIAL LEASE AGREEMENT

1. PARTIES: This Lease Agreement is made between LuxeRent Pro Management (Landlord) and the Tenant.
2. PROPERTY: Unit [Unit Number], LuxeRent Residences.
3. TERM: The term begins on [Start Date] and ends on [End Date].
4. RENT: Tenant agrees to pay $[Amount] per month, due on the 1st of each month via M-Pesa.
5. LATE FEES: A late fee of 5% will be applied if rent is not received by the 5th of the month.
6. UTILITIES: Tenant is responsible for electricity and water usage.
7. MAINTENANCE: Landlord shall maintain structural components; Tenant shall maintain cleanliness.
8. AMENITIES: Tenant has full access to the gym, pool, and rooftop lounge.

Signed by: ____________________ (Landlord)
Date: _________________________

Signed by: ____________________ (Tenant)
Date: _________________________
`;

export const MOCK_APARTMENTS: Apartment[] = [
  { id: '1', unitNumber: '101', floor: 1, type: 'Studio', rentAmount: 1200, status: ApartmentStatus.OCCUPIED },
  { id: '2', unitNumber: '102', floor: 1, type: '1BHK', rentAmount: 1500, status: ApartmentStatus.OCCUPIED },
  { id: '3', unitNumber: '201', floor: 2, type: '2BHK', rentAmount: 2200, status: ApartmentStatus.VACANT },
  { id: '4', unitNumber: '202', floor: 2, type: '2BHK', rentAmount: 2200, status: ApartmentStatus.OCCUPIED },
  { id: '5', unitNumber: '301', floor: 3, type: 'Penthouse', rentAmount: 4500, status: ApartmentStatus.MAINTENANCE },
];

export const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'John Doe', email: 'john@example.com', phone: '555-0101', apartmentId: '1', leaseStart: '2023-01-01', leaseEnd: '2024-01-01' },
  { id: 't2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', apartmentId: '2', leaseStart: '2023-05-15', leaseEnd: '2024-05-15' },
  { id: 't3', name: 'Robert Brown', email: 'robert@example.com', phone: '555-0103', apartmentId: '4', leaseStart: '2023-08-01', leaseEnd: '2024-08-01' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', tenantId: 't1', apartmentId: '1', amount: 1200, dueDate: '2023-11-01', status: PaymentStatus.PAID, description: 'November Rent', createdAt: '2023-10-25' },
  { id: 'inv2', tenantId: 't2', apartmentId: '2', amount: 1500, dueDate: '2023-11-01', status: PaymentStatus.PENDING, description: 'November Rent', createdAt: '2023-10-25' },
  { id: 'inv3', tenantId: 't3', apartmentId: '4', amount: 2200, dueDate: '2023-11-01', status: PaymentStatus.OVERDUE, description: 'November Rent', createdAt: '2023-10-25' },
  { id: 'inv4', tenantId: 't1', apartmentId: '1', amount: 1200, dueDate: '2023-10-01', status: PaymentStatus.PAID, description: 'October Rent', createdAt: '2023-09-25' },
];
