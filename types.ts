
export type View =
  | 'Dashboard'
  | 'Financials'
  | 'Invoices'
  | 'Payments'
  | 'Expenses'
  | 'Tenants'
  | 'Property/Unit'
  | 'Properties'
  | 'Units'
  | 'Utilities'
  | 'Maintenance'
  | 'Property Grouping'
  | 'Reports'
  | 'Statements'
  | 'Insights (beta)'
  | 'Communication'
  | 'Settings'
  | 'General'
  | 'Backup'
  | 'Alerts'
  | 'Account Info'
  | 'Documents (beta)'
  | 'Custom Message Template'
  | 'Team'
  | 'Billing'
  | 'MPESA Transactions'
  | 'Audit Trail'
  | 'Foundation'
  | 'Getting Started'
  | 'PropertyForm'
  | 'UnitForm'
  | 'TenantForm'
  | 'BulkTenantForm';

export interface RecurringBill {
  type: string;
  amount: number;
}

export interface NextOfKin {
  name: string;
  phone: string;
  relationship: string;
  otherInfo: string;
}

export interface Property {
  id: number;
  name: string;
  address: string;
  type: 'Residential' | 'Commercial';
  units: number;
  occupancy: number;
  imageUrl: string;
  // Extended fields
  city?: string;
  streetName?: string;
  waterRate?: number;
  electricityRate?: number;
  mpesaType?: 'Paybill' | 'Till';
  paybillNumber?: string;
  penaltyType?: string;
  taxRate?: number;
  managementFeeType?: string;
  companyName?: string;
  notes?: string;
  paymentInstructions?: string;
  ownerPhone?: string;
  recurringBills?: RecurringBill[];
}

export interface Unit {
  id: number;
  propertyId: number;
  propertyName: string;
  name: string;
  rentAmount: number;
  status: 'Vacant' | 'Occupied';
  type: 'Residential' | 'Commercial';
  // Extended fields
  category?: string;
  taxRate?: number;
  recurringBills?: RecurringBill[];
  notes?: string;
}

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  propertyId?: number;
  unit: string;
  unitId?: number;
  leaseEndDate: string;
  status: 'Active' | 'Inactive';
  avatarUrl: string;
  balance?: number;
  // Extended fields
  firstName?: string;
  lastName?: string;
  depositType?: string;
  depositPaid?: number;
  depositReturned?: number;
  accountNumber?: string;
  nationalId?: string;
  kraPin?: string;
  penaltyType?: string;
  notes?: string;
  moveInDate?: string;
  moveOutDate?: string;
  leaseStartDate?: string;
  otherPhones?: { name: string; phone: string }[];
  nextOfKin?: NextOfKin[];
  bankPayers?: string[];
}

export type ExpenseStatus = 'draft' | 'confirmed';

export interface Expense {
  id: number;
  date: string;
  property: string;
  unit: string;
  category: string;
  status: ExpenseStatus;
  amount: number;
  description?: string;
}

export interface RecurringExpense {
  id: number;
  description: string;
  property: string;
  unit: string;
  category: string;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
  amount: number;
  startDate: string;
  nextDueDate: string;
  status: 'Active' | 'Stopped';
}

export interface Invoice {
  id: number;
  date: string;
  invoiceNumber: string;
  tenantName: string;
  item: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'pending';
}

export interface Payment {
  id: number;
  date: string;
  paymentId: string;
  tenantName: string;
  propertyName: string;
  unitName: string;
  amount: number;
  method: string;
  status: 'confirmed' | 'pending';
}
