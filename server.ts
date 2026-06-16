import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = 3000;
const DB_FILE = './realtyos_db.json';

// Seed structure
interface DbSchema {
  users: any[];
  properties: any[];
  units: any[];
  tenants: any[];
  invoices: any[];
  payments: any[];
  maintenance: any[];
  leases: any[];
  chartOfAccounts: any[];
  journalEntries: any[];
  inspections: any[];
  mpesaTransactions: any[];
  vendors: any[];
  crmLeads: any[];
  assets: any[];
  expenses: any[];
  recurringExpenses: any[];
  settings: any;
  auditTrails: any[];
}

const initialDb: DbSchema = {
  users: [
    { id: 1, name: "Admin User", email: "admin@realtyos.com", password: "admin123", role: "Admin", username: "admin", isActive: 1, failedAttempts: 0, lockedUntil: 0 }
  ],
  properties: [
    { id: 1, name: "Sunshine Apartments", address: "123 Solar Way, Nairobi", city: "Nairobi", streetName: "Solar Way", waterRate: 150.0, electricityRate: 25.0, type: "Residential", units: 10, occupancy: 80.0 },
    { id: 2, name: "Business Plaza", address: "456 Commerce St, Mombasa", city: "Mombasa", streetName: "Commerce St", waterRate: 120.0, electricityRate: 30.0, type: "Commercial", units: 5, occupancy: 100.0 }
  ],
  units: [
    { id: 1, propertyId: 1, propertyName: "Sunshine Apartments", name: "A1", rentAmount: 25000.0, status: "Occupied", type: "Residential" },
    { id: 2, propertyId: 1, propertyName: "Sunshine Apartments", name: "A2", rentAmount: 25000.0, status: "Occupied", type: "Residential" },
    { id: 3, propertyId: 1, propertyName: "Sunshine Apartments", name: "A3", rentAmount: 25000.0, status: "Vacant", type: "Residential" },
    { id: 4, propertyId: 2, propertyName: "Business Plaza", name: "Shop 1", rentAmount: 50000.0, status: "Occupied", type: "Commercial" }
  ],
  tenants: [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "0712345678", property: "Sunshine Apartments", propertyId: 1, unit: "A1", unitId: 1, leaseEndDate: "2025-12-31", status: "Active", avatarUrl: "https://i.pravatar.cc/150?u=john", balance: 0.0 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0787654321", property: "Sunshine Apartments", propertyId: 1, unit: "A2", unitId: 2, leaseEndDate: "2025-06-30", status: "Active", avatarUrl: "https://i.pravatar.cc/150?u=jane", balance: 5000.0 }
  ],
  invoices: [
    { id: 1, date: "2024-02-01", dueDate: "2024-02-15", invoiceNumber: "INV-001", tenantName: "John Doe", item: "Rent - Feb 2024", amount: 25000.0, status: "paid", tenantId: 1, property: "Sunshine Apartments", unit: "A1" },
    { id: 2, date: "2024-02-01", dueDate: "2024-02-15", invoiceNumber: "INV-002", tenantName: "Jane Smith", item: "Rent - Feb 2024", amount: 25000.0, status: "pending", tenantId: 2, property: "Sunshine Apartments", unit: "A2" }
  ],
  payments: [
    { id: 1, date: "2024-02-02", paymentId: "PAY-001", tenantName: "John Doe", propertyName: "Sunshine Apartments", unitName: "A1", amount: 25000.0, method: "MPESA", status: "confirmed" }
  ],
  maintenance: [
    { id: 1, summary: "Leaking tap in kitchen", propertyName: "Sunshine Apartments", unitName: "A1", status: "Open", category: "Plumbing", expense: 0.0, date: "2023-10-25" },
    { id: 2, summary: "Broken window in living room", propertyName: "Ocean View", unitName: "B2", status: "In Progress", category: "Repair", expense: 5000.0, date: "2023-10-24" }
  ],
  leases: [
    { id: 1, tenantId: 1, tenantName: "John Doe", unitId: 1, unitName: "A1", startDate: "2024-01-01", endDate: "2025-12-31", status: "Active", rentEscalationPercentage: 10.0, securityDepositAmount: 25000.0, signatureStatus: "Signed", signedDate: "2024-01-01", coTenants: [{ name: "Alex Doe", relationship: "Spouse" }], guarantorName: "Mark Doe" },
    { id: 2, tenantId: 2, tenantName: "Jane Smith", unitId: 2, unitName: "A2", startDate: "2024-01-01", endDate: "2025-06-30", status: "RenewalDue", rentEscalationPercentage: 5.0, securityDepositAmount: 25000.0, signatureStatus: "Signed", signedDate: "2024-01-01", coTenants: [], guarantorName: "" }
  ],
  chartOfAccounts: [
    { code: "1010", name: "Bank Account (Current)", type: "Asset", balance: 500000.00 },
    { code: "1020", name: "Accounts Receivable", type: "Asset", balance: 5000.00 },
    { code: "2010", name: "Tenant Security Deposits", type: "Liability", balance: 50000.00 },
    { code: "4010", name: "Rental Revenue", type: "Revenue", balance: 125000.00 },
    { code: "5010", name: "Repairs & Maintenance Expense", type: "Expense", balance: 5000.00 }
  ],
  journalEntries: [
    { id: "JE-001", date: "2024-02-01", reference: "BILL-RENT-FEB-24", description: "Rent billing accrual for Sunshine Apartments (Tenant: Jane Smith)", lines: [{ accountCode: "1020", accountName: "Accounts Receivable", debit: 25000.0, credit: 0.0 }, { accountCode: "4010", accountName: "Rental Revenue", debit: 0.0, credit: 25000.0 }] },
    { id: "JE-002", date: "2024-02-02", reference: "RCV-MPESA-PAY-001", description: "Rent collection check for Sunshine Apartments (Tenant: John Doe)", lines: [{ accountCode: "1010", accountName: "Bank Account (Current)", debit: 25000.0, credit: 0.0 }, { accountCode: "1020", accountName: "Accounts Receivable", debit: 0.0, credit: 25000.0 }] }
  ],
  inspections: [
    { id: 1, propertyName: "Sunshine Apartments", unitName: "A1", type: "Move-In", date: "2024-01-01", inspector: "Admin Inspector", status: "Passed", notes: "All water taps flow check, locks functional, clean paint job.", checklist: { wallCondition: "Excellent", plumbingLeaks: "None", locksWorking: "Yes", paintApplied: "Yes" } },
    { id: 2, propertyName: "Sunshine Apartments", unitName: "A2", type: "Move-Out", date: "2025-06-15", inspector: "Admin Inspector", status: "Issues Found", notes: "Living room wall has persistent moisture damages; living space window screen is torn.", checklist: { wallCondition: "Dampness Identified", plumbingLeaks: "None", locksWorking: "Yes", paintApplied: "No" } }
  ],
  mpesaTransactions: [
    { id: "MPESA-TR-001", checkoutRequestId: "ws_CO_11061745_A23", phoneNumber: "0712345678", amount: 25000.0, mpesaReceiptNumber: "S231A90B3D", status: "Success", timestamp: "2024-02-02T08:00:15Z", tenantName: "John Doe" }
  ],
  vendors: [
    { id: 1, name: "Nairobi Smart Plumbing Solutions", contact: "0722222222", rating: 4.8, jobsCompleted: 45, specialty: "Plumbing", licenseNo: "NCA-PL-9989" },
    { id: 2, name: "Fast Electrics Contractors", contact: "0733333333", rating: 4.6, jobsCompleted: 38, specialty: "Electrical", licenseNo: "EPRA-EL-2311" }
  ],
  crmLeads: [
    { id: 1, name: "David Kimani", phone: "0711122233", email: "david@example.com", propertyInterest: "Sunshine Apartments", preferredType: "Residential", status: "Contacted", note: "Requests a ground-floor suite with high water flow." },
    { id: 2, name: "Grace Wanjiku", phone: "0722233344", email: "grace@example.com", propertyInterest: "Business Plaza", preferredType: "Commercial", status: "New Lead", note: "Interested in setting up a logistics office center." }
  ],
  assets: [
    { id: 1, propertyName: "Sunshine Apartments", name: "Backup Generator 150kVA", code: "GEN-01", purchaseDate: "2022-05-15", cost: 1200000.0, depreciationMethod: "Straight Line", estimatedLife: 10, currentBookValue: 960000.0, lastServiceDate: "2023-11-20" },
    { id: 2, propertyName: "Business Plaza", name: "Main Water Intake Booster Pump", code: "PMP-01", purchaseDate: "2023-01-10", cost: 350000.0, depreciationMethod: "Straight Line", estimatedLife: 5, currentBookValue: 280000.0, lastServiceDate: "2024-01-15" }
  ],
  expenses: [],
  recurringExpenses: [],
  settings: {
    general: { companyName: "RealtyOS Ltd", email: "admin@realtyos.com", phone: "+254 700 000 000", currency: "KES" },
    alerts: { emailNotifications: true, smsNotifications: false, paymentReminders: true }
  },
  auditTrails: [
    { id: 1, timestamp: "2026-06-13T09:00:00Z", user: "Admin User", action: "System Initialize", details: "Core multi-tenant ledger accounts, SQLite backend active, schema and assets seeded." }
  ]
};

// Ensure JSON file exists
function loadDb(): DbSchema {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON DB', err);
    return initialDb;
  }
}

function saveDb(data: DbSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Helper to sanitize tags
function sanitizeText(val: any): string {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>/g, '').trim();
}

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// --- AUTH GETWAY ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const db = loadDb();
  const u = db.users.find(x => x.email.toLowerCase() === email.toLowerCase().trim());
  if (u && u.password === password) {
    res.json({
      token: "mock-jwt-token-realtyos-secure",
      user: {
        id: u.id,
        name: u.name,
        role: u.role,
        email: u.email,
        username: u.username
      }
    });
    return;
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// --- DYNAMIC DATA ---
app.get('/api/data', (req, res) => {
  const db = loadDb();
  res.json({
    properties: db.properties,
    units: db.units,
    tenants: db.tenants,
    expenses: db.expenses,
    recurringExpenses: db.recurringExpenses,
    invoices: db.invoices,
    payments: db.payments,
    maintenance: db.maintenance,
    settings: db.settings
  });
});

app.get('/api/dashboard/stats', (req, res) => {
  const db = loadDb();
  let totalArrears = 0;
  let tenantsArrearsCount = 0;
  let totalAdvance = 0;
  let tenantsAdvanceCount = 0;

  (db.tenants || []).forEach(t => {
    const bal = t.balance || 0;
    if (bal > 0) {
      totalArrears += bal;
      tenantsArrearsCount++;
    } else if (bal < 0) {
      totalAdvance += Math.abs(bal);
      tenantsAdvanceCount++;
    }
  });

  const totalUnits = db.units.length;
  const occupiedUnits = db.units.filter(u => u.status === 'Occupied').length;
  const occupancyRate = totalUnits > 0 ? parseFloat(((occupiedUnits / totalUnits) * 100).toFixed(1)) : 0;

  res.json({
    totalArrears,
    tenantsArrearsCount,
    totalAdvance,
    tenantsAdvanceCount,
    occupancyRate,
    totalUnits,
    occupiedUnits
  });
});

// --- PROPERTIES REST ---
app.get('/api/properties', (req, res) => {
  res.json(loadDb().properties);
});

app.post('/api/properties', (req, res) => {
  const body = req.body || {};
  const name = sanitizeText(body.name);
  const address = sanitizeText(body.address);
  const city = sanitizeText(body.city);
  const streetName = sanitizeText(body.streetName);
  const waterRate = parseFloat(body.waterRate) || 0;
  const electricityRate = parseFloat(body.electricityRate) || 0;
  const prop_type = body.type || 'Residential';
  const units_qty = parseInt(body.units) || 0;

  if (!name) {
    res.status(400).json({ error: 'Property name is required' });
    return;
  }

  const db = loadDb();
  if (db.properties.some(x => x.name.toLowerCase() === name.toLowerCase())) {
    res.status(409).json({ error: `A property with the name "${name}" already exists` });
    return;
  }

  const newProp = {
    id: Date.now() % 10000000,
    name,
    address,
    city,
    streetName,
    waterRate,
    electricityRate,
    type: prop_type,
    units: units_qty,
    occupancy: 0
  };

  db.properties.push(newProp);
  db.auditTrails.unshift({
    id: db.auditTrails.length + 1,
    timestamp: new Date().toISOString(),
    user: 'Admin User',
    action: 'Property Created',
    details: `Added property: ${name}`
  });

  saveDb(db);
  res.status(201).json(newProp);
});

// --- UNITS REST ---
app.get('/api/units', (req, res) => {
  res.json(loadDb().units);
});

app.post('/api/units', (req, res) => {
  const body = req.body || {};
  const payloads = Array.isArray(body) ? body : [body];
  const processed: any[] = [];
  const db = loadDb();

  for (const item of payloads) {
    const propertyId = parseInt(item.propertyId);
    const name = sanitizeText(item.name);
    const rentAmount = parseFloat(item.rentAmount) || 0;

    if (!propertyId || !name) {
      res.status(400).json({ error: 'Unit Name and Property are required' });
      return;
    }

    const prop = db.properties.find(x => x.id === propertyId);
    if (!prop) {
      res.status(400).json({ error: `Associated property ID ${propertyId} does not exist` });
      return;
    }

    if (db.units.some(x => x.propertyId === propertyId && x.name.toLowerCase() === name.toLowerCase())) {
      res.status(409).json({ error: `Unit "${name}" already exists in "${prop.name}"` });
      return;
    }

    const newUnit = {
      id: (Date.now() + processed.length) % 10000000,
      propertyId,
      propertyName: prop.name,
      name,
      rentAmount,
      status: 'Vacant',
      type: prop.type
    };

    db.units.push(newUnit);
    processed.push(newUnit);
  }

  saveDb(db);
  res.status(201).json(processed);
});

// --- TENANTS REST ---
app.get('/api/tenants', (req, res) => {
  res.json(loadDb().tenants);
});

app.post('/api/tenants', (req, res) => {
  const body = req.body || {};
  const payloads = Array.isArray(body) ? body : [body];
  const processed: any[] = [];
  const db = loadDb();

  for (const item of payloads) {
    const name = sanitizeText(item.name);
    const email = sanitizeText(item.email);
    const phone = sanitizeText(item.phone);
    const property_name = item.property;
    const unit_name = item.unit;
    const unitId = item.unitId ? parseInt(item.unitId) : null;
    const leaseEndDate = item.leaseEndDate;

    if (!name) {
      res.status(400).json({ error: 'Tenant Name is required' });
      return;
    }

    let targetUnit = null;
    if (unitId) {
      targetUnit = db.units.find(x => x.id === unitId);
    } else {
      targetUnit = db.units.find(x => x.propertyName === property_name && x.name === unit_name);
    }

    if (!targetUnit) {
      res.status(400).json({ error: 'Unit in property is not registered' });
      return;
    }

    if (targetUnit.status === 'Occupied') {
      res.status(409).json({ error: `Unit "${targetUnit.name}" in "${targetUnit.propertyName}" is currently occupied` });
      return;
    }

    const tenant_id = (Date.now() + processed.length) % 10000000;
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const lease_end = leaseEndDate || oneYearFromNow.toISOString().split('T')[0];
    const avatar = item.avatarUrl || `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`;

    const newTenant = {
      id: tenant_id,
      name,
      email,
      phone,
      property: targetUnit.propertyName,
      propertyId: targetUnit.propertyId,
      unit: targetUnit.name,
      unitId: targetUnit.id,
      leaseEndDate: lease_end,
      status: 'Active',
      avatarUrl: avatar,
      balance: 0.0
    };

    targetUnit.status = 'Occupied';
    db.tenants.push(newTenant);
    processed.push(newTenant);
  }

  saveDb(db);
  res.status(201).json(processed);
});

app.put('/api/tenants/:id', (req, res) => {
  const tenantId = parseInt(req.params.id);
  const { status, leaseEndDate } = req.body || {};
  const db = loadDb();

  const tenant = db.tenants.find(x => x.id === tenantId);
  if (!tenant) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }

  if (['Inactive', 'Move-out', 'Move-Out'].includes(status)) {
    tenant.status = 'Inactive';
    if (leaseEndDate) tenant.leaseEndDate = leaseEndDate;
    const unit = db.units.find(x => x.id === tenant.unitId);
    if (unit) unit.status = 'Vacant';
  } else {
    if (status) tenant.status = status;
    if (leaseEndDate) tenant.leaseEndDate = leaseEndDate;
  }

  db.auditTrails.unshift({
    id: db.auditTrails.length + 1,
    timestamp: new Date().toISOString(),
    user: 'Admin User',
    action: 'Tenant Update',
    details: `Updated tenant ${tenant.name} status to ${status || tenant.status}.`
  });

  saveDb(db);
  res.json(tenant);
});

// --- LEASES REST ---
app.get('/api/leases', (req, res) => {
  res.json(loadDb().leases);
});

app.post('/api/leases', (req, res) => {
  const body = req.body || {};
  const tenantId = parseInt(body.tenantId);
  const unitId = parseInt(body.unitId);
  const startDate = body.startDate;
  const endDate = body.endDate;
  const rentEsc = parseFloat(body.rentEscalationPercentage) || 0;
  const secDep = parseFloat(body.securityDepositAmount) || 0;
  const coTenants = body.coTenants || [];
  const guarantor = body.guarantorName || '';

  if (isNaN(tenantId) || isNaN(unitId)) {
    res.status(400).json({ error: 'tenantId and unitId must be valid numbers' });
    return;
  }

  const db = loadDb();
  const tenant = db.tenants.find(x => x.id === tenantId);
  const unit = db.units.find(x => x.id === unitId);

  if (!tenant || !unit) {
    res.status(404).json({ error: 'Tenant or Unit not found' });
    return;
  }

  const lease_id = Date.now() % 10000000;
  const newLease = {
    id: lease_id,
    tenantId,
    tenantName: tenant.name,
    unitId,
    unitName: unit.name,
    startDate,
    endDate,
    status: 'Active',
    rentEscalationPercentage: rentEsc,
    securityDepositAmount: secDep,
    signatureStatus: 'Signed',
    signedDate: new Date().toISOString().split('T')[0],
    coTenants,
    guarantorName: guarantor
  };

  db.leases.push(newLease);

  // Escrow journal setup
  if (secDep > 0) {
    const coa1010 = db.chartOfAccounts.find(x => x.code === '1010');
    const coa2010 = db.chartOfAccounts.find(x => x.code === '2010');
    if (coa1010) coa1010.balance += secDep;
    if (coa2010) coa2010.balance += secDep;

    const jeLines = [
      { accountCode: '1010', accountName: 'Bank Account (Current)', debit: secDep, credit: 0.0 },
      { accountCode: '2010', accountName: 'Tenant Security Deposits', debit: 0.0, credit: secDep }
    ];

    db.journalEntries.push({
      id: `JE-DEP-${lease_id % 10000}`,
      date: new Date().toISOString().split('T')[0],
      reference: `LEASE-DEP-${lease_id}`,
      description: `Security deposit escrow transfer for Unit ${unit.name}`,
      lines: jeLines
    });
  }

  db.auditTrails.unshift({
    id: db.auditTrails.length + 1,
    timestamp: new Date().toISOString(),
    user: 'Admin User',
    action: 'Lease Created',
    details: `New lease active for Tenant ${tenant.name} in Unit ${unit.name}`
  });

  saveDb(db);
  res.status(201).json(newLease);
});

app.put('/api/leases/:id', (req, res) => {
  const leaseId = parseInt(req.params.id);
  const { status, rentEscalationPercentage } = req.body || {};
  const db = loadDb();

  const lease = db.leases.find(x => x.id === leaseId);
  if (!lease) {
    res.status(404).json({ error: 'Lease agreement not found' });
    return;
  }

  if (status) lease.status = status;
  if (rentEscalationPercentage !== undefined) lease.rentEscalationPercentage = parseFloat(rentEscalationPercentage) || 0;

  db.auditTrails.unshift({
    id: db.auditTrails.length + 1,
    timestamp: new Date().toISOString(),
    user: 'Admin User',
    action: 'Lease Modified',
    details: `Renewed/Updated lease ID: ${leaseId} to status ${status || lease.status}`
  });

  saveDb(db);
  res.json(lease);
});

// --- INVOICES REST ---
app.get('/api/invoices', (req, res) => {
  res.json(loadDb().invoices);
});

app.post('/api/invoices', (req, res) => {
  const body = req.body || {};
  const tenantId = parseInt(body.tenantId);
  const amount = parseFloat(body.amount) || 0;
  const dueDate = body.dueDate;
  const invoiceNo = body.invoiceNumber || `INV-${Date.now() % 1000000}`;
  const description = sanitizeText(body.description || 'Rent Extra charge');

  const db = loadDb();
  const tenant = db.tenants.find(x => x.id === tenantId);
  if (!tenant) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }

  if (db.invoices.some(x => x.invoiceNumber.toLowerCase() === invoiceNo.toLowerCase())) {
    res.status(409).json({ error: `An invoice with number "${invoiceNo}" already exists` });
    return;
  }

  const inv_id = Date.now() % 10000000;
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 14);
  const due = dueDate || defaultDue.toISOString().split('T')[0];

  const newInvoice = {
    id: inv_id,
    date: new Date().toISOString().split('T')[0],
    dueDate: due,
    invoiceNumber: invoiceNo,
    tenantName: tenant.name,
    item: description,
    amount,
    status: 'pending',
    tenantId: tenant.id,
    property: tenant.property,
    unit: tenant.unit
  };

  tenant.balance += amount;
  db.invoices.push(newInvoice);

  saveDb(db);
  res.status(201).json(newInvoice);
});

// --- PAYMENTS REST ---
app.get('/api/payments', (req, res) => {
  res.json(loadDb().payments);
});

app.post('/api/payments', (req, res) => {
  const body = req.body || {};
  const tenantName = body.tenantName;
  const amount = parseFloat(body.amount) || 0;
  const paymentId = body.paymentId || `PAY-${Date.now() % 1000000}`;
  const method = body.method || 'MPESA';
  const date = body.date || new Date().toISOString().split('T')[0];

  if (!tenantName || amount <= 0) {
    res.status(400).json({ error: 'Tenant name and positive amount are required' });
    return;
  }

  const db = loadDb();
  if (db.payments.some(x => x.paymentId.toLowerCase() === paymentId.toLowerCase())) {
    res.status(409).json({ error: `A transaction with reference "${paymentId}" has already been processed` });
    return;
  }

  const tenant = db.tenants.find(x => x.name.toLowerCase() === tenantName.toLowerCase());
  if (!tenant) {
    res.status(404).json({ error: `No active tenant matches the name "${tenantName}"` });
    return;
  }

  const pay_id = Date.now() % 10000000;
  const newPayment = {
    id: pay_id,
    date,
    paymentId,
    tenantName: tenant.name,
    propertyName: tenant.property,
    unitName: tenant.unit,
    amount,
    method,
    status: 'confirmed'
  };

  tenant.balance -= amount;

  // FIFO list reduction
  let remaining = amount;
  const pendingInvoices = db.invoices.filter(x => x.tenantId === tenant.id && x.status === 'pending').sort((a,b) => a.date.localeCompare(b.date));
  for (const inv of pendingInvoices) {
    if (remaining <= 0) break;
    if (remaining >= inv.amount) {
      remaining -= inv.amount;
      inv.status = 'paid';
    } else {
      inv.amount -= remaining;
      remaining = 0;
    }
  }

  db.payments.push(newPayment);
  saveDb(db);
  res.status(201).json(newPayment);
});

// --- EXPENSES REST ---
app.get('/api/expenses', (req, res) => {
  res.json(loadDb().expenses);
});

app.post('/api/expenses', (req, res) => {
  const body = req.body || {};
  const property_name = sanitizeText(body.property);
  const amount = parseFloat(body.amount) || 0;
  const date = body.date || new Date().toISOString().split('T')[0];
  const status = body.status || 'Paid';
  const category = body.category || 'Other';

  const db = loadDb();
  const exp_id = Date.now() % 10000000;
  const newExp = {
    id: exp_id,
    property: property_name,
    amount,
    date,
    status,
    category
  };

  db.expenses.push(newExp);
  saveDb(db);
  res.status(201).json(newExp);
});

// --- RECURRING EXPENSES ---
app.get('/api/recurring-expenses', (req, res) => {
  res.json(loadDb().recurringExpenses);
});

app.post('/api/recurring-expenses', (req, res) => {
  const body = req.body || {};
  const property_name = sanitizeText(body.property);
  const amount = parseFloat(body.amount) || 0;
  const frequency = body.frequency || 'Monthly';

  const db = loadDb();
  const rec_id = Date.now() % 10000000;
  const newRec = {
    id: rec_id,
    property: property_name,
    amount,
    frequency,
    status: 'Active'
  };

  db.recurringExpenses.push(newRec);
  saveDb(db);
  res.status(201).json(newRec);
});

// --- MAINTENANCE REST ---
app.get('/api/maintenance', (req, res) => {
  res.json(loadDb().maintenance);
});

app.post('/api/maintenance', (req, res) => {
  const body = req.body || {};
  const propertyName = sanitizeText(body.propertyName || body.property);
  const unitName = sanitizeText(body.unitName || body.unit);
  const summary = sanitizeText(body.summary || body.description || 'General repair request');
  const category = sanitizeText(body.category || 'General');
  const date = body.date || new Date().toISOString().split('T')[0];

  const db = loadDb();
  const m_id = Date.now() % 10000000;
  const newM = {
    id: m_id,
    summary,
    propertyName,
    unitName,
    category,
    date,
    status: 'Open',
    expense: 0.0
  };

  db.maintenance.push(newM);
  saveDb(db);
  res.status(201).json(newM);
});

// --- SETTINGS REST ---
app.get('/api/settings', (req, res) => {
  res.json(loadDb().settings);
});

app.post('/api/settings', (req, res) => {
  const body = req.body || {};
  const general = body.general || {};
  const alerts = body.alerts || {};

  const db = loadDb();
  db.settings = { general, alerts };
  saveDb(db);
  res.json(db.settings);
});

// --- CHART OF ACCOUNTS & JOURNAL ENTRIES ---
app.get('/api/chart-of-accounts', (req, res) => {
  res.json(loadDb().chartOfAccounts);
});

app.get('/api/journal-entries', (req, res) => {
  res.json(loadDb().journalEntries);
});

app.post('/api/journal-entries', (req, res) => {
  const body = req.body || {};
  const date = body.date || new Date().toISOString().split('T')[0];
  const reference = sanitizeText(body.reference);
  const description = sanitizeText(body.description);
  const lines = body.lines || [];

  if (!reference || lines.length < 2) {
    res.status(400).json({ error: 'Reference and at least two journal ledger lines are required' });
    return;
  }

  const db = loadDb();
  let totalDebit = 0;
  let totalCredit = 0;

  for (const line of lines) {
    totalDebit += parseFloat(line.debit) || 0;
    totalCredit += parseFloat(line.credit) || 0;
  }

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    res.status(400).json({ error: `Double-entry unbalance error. Total Debits (KES ${totalDebit}) must match Total Credits (KES ${totalCredit})` });
    return;
  }

  // Update chart of accounts balances
  for (const line of lines) {
    const coa = db.chartOfAccounts.find(x => x.code === line.accountCode);
    if (!coa) {
      res.status(400).json({ error: `Chart of account code ${line.accountCode} does not exist inside organization portfolio` });
      return;
    }
    const debit = parseFloat(line.debit) || 0;
    const credit = parseFloat(line.credit) || 0;

    if (['Asset', 'Expense'].includes(coa.type)) {
      coa.balance += (debit - credit);
    } else {
      coa.balance += (credit - debit);
    }
  }

  const je_id = `JE-MAN-${Date.now() % 10000}`;
  const newJe = {
    id: je_id,
    date,
    reference,
    description,
    lines
  };

  db.journalEntries.push(newJe);
  saveDb(db);
  res.status(201).json(newJe);
});

// --- MPESA WEBHOOK SIMULATION ---
app.get('/api/mpesa/transactions', (req, res) => {
  res.json(loadDb().mpesaTransactions);
});

app.post('/api/mpesa/c2b-simulate', (req, res) => {
  const body = req.body || {};
  const phoneNumber = sanitizeText(body.phoneNumber);
  const amount = parseFloat(body.amount) || 0;
  const receiptNo = sanitizeText(body.mpesaReceiptNumber || '').toUpperCase();
  const tenantId = parseInt(body.tenantId);

  if (!phoneNumber || amount <= 0 || !receiptNo) {
    res.status(400).json({ error: 'Simulated M-PESA parameters (phone, amount, Receipt Ref) are required.' });
    return;
  }

  const db = loadDb();
  if (db.mpesaTransactions.some(x => x.mpesaReceiptNumber.toLowerCase() === receiptNo.toLowerCase())) {
    res.status(409).json({ error: `Direct payment mismatch, M-PESA receipt reference "${receiptNo}" already exists.` });
    return;
  }

  const tenant = db.tenants.find(x => x.id === tenantId);
  if (!tenant) {
    res.status(404).json({ error: 'Associated tenant portfolio does not exist.' });
    return;
  }

  // FIFO allocation
  let remaining = amount;
  let settledCount = 0;
  const pendingInvoices = db.invoices.filter(x => x.tenantId === tenant.id && x.status === 'pending').sort((a,b) => a.date.localeCompare(b.date));
  for (const inv of pendingInvoices) {
    if (remaining <= 0) break;
    settledCount++;
    if (remaining >= inv.amount) {
      remaining -= inv.amount;
      inv.status = 'paid';
    } else {
      inv.amount -= remaining;
      remaining = 0;
    }
  }

  tenant.balance -= amount;

  const tx_id = `MPESA-TR-${Date.now() % 1000}`;
  const transaction = {
    id: tx_id,
    checkoutRequestId: `ws_CO_${Math.floor(Math.random() * 9000000) + 1000000}`,
    phoneNumber,
    amount,
    mpesaReceiptNumber: receiptNo,
    status: 'Success',
    timestamp: new Date().toISOString(),
    tenantName: tenant.name
  };

  db.mpesaTransactions.unshift(transaction);

  // Update accounting ledger to double-entry escrow
  const bankCoA = db.chartOfAccounts.find(x => x.code === '1010');
  const revenueCoA = db.chartOfAccounts.find(x => x.code === '4010');
  if (bankCoA) bankCoA.balance += amount;
  if (revenueCoA) revenueCoA.balance += amount;

  db.journalEntries.push({
    id: `JE-MPESA-${Date.now() % 10000}`,
    date: new Date().toISOString().split('T')[0],
    reference: `MPESA-${receiptNo}`,
    description: `M-Pesa payment collected from tenant: ${tenant.name}`,
    lines: [
      { accountCode: '1010', accountName: 'Bank Account (Current)', debit: amount, credit: 0.0 },
      { accountCode: '4010', accountName: 'Rental Revenue', debit: 0.0, credit: amount }
    ]
  });

  db.auditTrails.unshift({
    id: db.auditTrails.length + 1,
    timestamp: new Date().toISOString(),
    user: 'M-PESA Webhook Callback Processing Service',
    action: 'Payment Processed',
    details: `MPESA Ref ${receiptNo}. KES ${amount} reconciled with ${tenant.name}.`
  });

  saveDb(db);
  res.status(201).json({
    tenantMatched: tenant.name,
    invoiceSettlements: settledCount,
    status: 'Success'
  });
});

// --- INSPECTIONS REST ---
app.get('/api/inspections', (req, res) => {
  res.json(loadDb().inspections);
});

app.post('/api/inspections', (req, res) => {
  const body = req.body || {};
  const propertyName = sanitizeText(body.propertyName);
  const unitName = sanitizeText(body.unitName);
  const type = sanitizeText(body.type || 'Move-In');
  const notes = sanitizeText(body.notes || '');

  const db = loadDb();
  const ins_id = Date.now() % 10000000;
  const checklist = body.checklist || { wallCondition: 'Good', plumbingLeaks: 'None', locksWorking: 'Yes', paintApplied: 'Yes' };

  const newIns = {
    id: ins_id,
    propertyName,
    unitName,
    type,
    date: new Date().toISOString().split('T')[0],
    inspector: 'Admin Inspector',
    status: 'Passed',
    notes,
    checklist
  };

  db.inspections.push(newIns);
  saveDb(db);
  res.status(201).json(newIns);
});

// --- AUDIT TRAIL ---
app.get('/api/audit-trail', (req, res) => {
  res.json(loadDb().auditTrails);
});

// --- VENDORS REST ---
app.get('/api/vendors', (req, res) => {
  res.json(loadDb().vendors);
});

// --- CRM LEADS REST ---
app.get('/api/crm-leads', (req, res) => {
  res.json(loadDb().crmLeads);
});

app.post('/api/crm-leads', (req, res) => {
  const body = req.body || {};
  const name = sanitizeText(body.name);
  const phone = sanitizeText(body.phone);
  const email = sanitizeText(body.email);
  const propertyInterest = sanitizeText(body.propertyInterest || 'Sunshine Apartments');
  const note = sanitizeText(body.note || 'Created via lead capturing pipeline.');

  if (!name || !phone) {
    res.status(400).json({ error: 'Lead Name and Phone are required' });
    return;
  }

  const db = loadDb();
  const lead_id = Date.now() % 10000000;
  const newLead = {
    id: lead_id,
    name,
    phone,
    email,
    propertyInterest,
    preferredType: 'Residential',
    status: 'New Lead',
    note
  };

  db.crmLeads.push(newLead);
  saveDb(db);
  res.status(201).json(newLead);
});

// --- ASSETS REST ---
app.get('/api/assets', (req, res) => {
  res.json(loadDb().assets);
});

// --- simulated OCR doc service ---
app.post('/api/ocr/analyze', (req, res) => {
  const body = req.body || {};
  const text = body.textToAnalyze || '';
  const file_name = sanitizeText(body.fileName || 'scanned_lease_contract.txt');

  if (!text) {
    res.status(400).json({ error: 'Document body text must be supplied to analyze metadata.' });
    return;
  }

  const text_lower = text.toLowerCase();
  let detected_tenant = 'John Doe';
  if (text_lower.includes('smith')) {
    detected_tenant = 'Jane Smith';
  } else if (text_lower.includes('kimani')) {
    detected_tenant = 'David Kimani';
  } else if (text_lower.includes('wanjiku')) {
    detected_tenant = 'Grace Wanjiku';
  }

  let rent_amount = 25000.0;
  const matches = text_lower.match(/kes\s?(\d+[\d,]*)/) || text_lower.match(/rent\s?:\s?(\d+[\d,]*)/) || text_lower.match(/shillings\s?(\d+[\d,]*)/);
  if (matches) {
    const val = parseFloat(matches[1].replace(/,/g, ''));
    if (!isNaN(val)) rent_amount = val;
  }

  const db = loadDb();
  const ocr_id = `OCR-${Date.now() % 10000}`;
  const date_analyzed = new Date().toISOString().split('T')[0];

  const doc = {
    id: ocr_id,
    fileName: file_name,
    size: '154KB',
    dateAnalyzed: date_analyzed,
    parsedAmount: rent_amount,
    confidence: 95.8,
    tenantDetected: detected_tenant,
    leasePeriod: '12 Months'
  };

  db.auditTrails.unshift({
    id: db.auditTrails.length + 1,
    timestamp: new Date().toISOString(),
    user: 'Document Intelligence AI Engine',
    action: 'Lease OCR Parsed',
    details: `Analyzed scanned document ${file_name}. Extracted tenant ${detected_tenant} with rent allowance KES ${rent_amount}.`
  });

  saveDb(db);
  res.json(doc);
});

// --- VITE MIDDLEWARE SETUP ---
(async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Node Express Server running on http://localhost:${PORT}`);
  });
})();
