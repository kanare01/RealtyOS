
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Tenant, Unit, Expense, Invoice, Payment, RecurringExpense, Maintenance } from '../types';

interface DataContextType {
    properties: Property[];
    tenants: Tenant[];
    units: Unit[];
    expenses: Expense[];
    recurringExpenses: RecurringExpense[];
    invoices: Invoice[];
    payments: Payment[];
    maintenance: Maintenance[];
    settings: any;
    lastCreatedUnits: Unit[];
    loading: boolean;
    error: string | null;
    addProperty: (property: Property) => Promise<void>;
    addUnit: (unit: Unit) => Promise<void>;
    addUnits: (units: Unit[]) => Promise<void>;
    addTenant: (tenant: Tenant) => Promise<void>;
    addTenants: (tenants: Tenant[]) => Promise<void>;
    addExpense: (expense: Expense) => Promise<void>;
    addRecurringExpense: (expense: RecurringExpense) => Promise<void>;
    addInvoice: (invoice: Invoice) => Promise<void>;
    addPayment: (payment: Payment) => Promise<void>;
    addMaintenance: (maintenance: Maintenance) => Promise<void>;
    updateSettings: (settings: any) => Promise<void>;
    getUnitsByProperty: (propertyName: string) => Unit[];
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [lastCreatedUnits, setLastCreatedUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/data');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setProperties(data.properties);
            setTenants(data.tenants);
            setUnits(data.units);
            setExpenses(data.expenses);
            setRecurringExpenses(data.recurringExpenses);
            setInvoices(data.invoices);
            setPayments(data.payments);
            setMaintenance(data.maintenance || []);
            setSettings(data.settings);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleApiResponse = async (response: Response, errorMessage: string) => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const apiError = errorData.error || `Server error (${response.status})`;
            alert(`${errorMessage}: ${apiError}`);
            throw new Error(apiError);
        }
        return response.json().catch(() => ({}));
    };

    const addProperty = async (property: Property) => {
        try {
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(property),
            });
            await handleApiResponse(response, 'Failed to add property');
            await refreshData();
        } catch (err) {
            console.error('addProperty error:', err);
            throw err;
        }
    };

    const addUnit = async (unit: Unit) => {
        try {
            const response = await fetch('/api/units', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unit),
            });
            const created = await handleApiResponse(response, 'Failed to add unit');
            setLastCreatedUnits(created);
            await refreshData();
        } catch (err) {
            console.error('addUnit error:', err);
            throw err;
        }
    };

    const addUnits = async (newUnits: Unit[]) => {
        try {
            const response = await fetch('/api/units', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUnits),
            });
            const created = await handleApiResponse(response, 'Failed to add units');
            setLastCreatedUnits(created);
            await refreshData();
        } catch (err) {
            console.error('addUnits error:', err);
            throw err;
        }
    };

    const addTenant = async (tenant: Tenant) => {
        try {
            const response = await fetch('/api/tenants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tenant),
            });
            await handleApiResponse(response, 'Failed to add tenant');
            await refreshData();
        } catch (err) {
            console.error('addTenant error:', err);
            throw err;
        }
    };

    const addTenants = async (newTenants: Tenant[]) => {
        try {
            const response = await fetch('/api/tenants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTenants),
            });
            await handleApiResponse(response, 'Failed to add bulk tenants');
            await refreshData();
        } catch (err) {
            console.error('addTenants error:', err);
            throw err;
        }
    };

    const addExpense = async (expense: Expense) => {
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });
            await handleApiResponse(response, 'Failed to add expense');
            await refreshData();
        } catch (err) {
            console.error('addExpense error:', err);
            throw err;
        }
    };

    const addRecurringExpense = async (expense: RecurringExpense) => {
        try {
            const response = await fetch('/api/recurring-expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });
            await handleApiResponse(response, 'Failed to add recurring expense');
            await refreshData();
        } catch (err) {
            console.error('addRecurringExpense error:', err);
            throw err;
        }
    };

    const addInvoice = async (invoice: Invoice) => {
        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoice),
            });
            await handleApiResponse(response, 'Failed to add invoice');
            await refreshData();
        } catch (err) {
            console.error('addInvoice error:', err);
            throw err;
        }
    };

    const addPayment = async (payment: Payment) => {
        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payment),
            });
            await handleApiResponse(response, 'Failed to add payment');
            await refreshData();
        } catch (err) {
            console.error('addPayment error:', err);
            throw err;
        }
    };

    const addMaintenance = async (m: Maintenance) => {
        try {
            const response = await fetch('/api/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(m),
            });
            await handleApiResponse(response, 'Failed to add maintenance');
            await refreshData();
        } catch (err) {
            console.error('addMaintenance error:', err);
            throw err;
        }
    };

    const updateSettings = async (newSettings: any) => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings),
            });
            await handleApiResponse(response, 'Failed to update settings');
            await refreshData();
        } catch (err) {
            console.error('updateSettings error:', err);
            throw err;
        }
    };

    const getUnitsByProperty = (propertyName: string) => {
        return units.filter(u => u.propertyName === propertyName);
    };

    return (
        <DataContext.Provider value={{
            properties,
            tenants,
            units,
            expenses,
            recurringExpenses,
            invoices,
            payments,
            maintenance,
            settings,
            lastCreatedUnits,
            loading,
            error,
            addProperty,
            addUnit,
            addUnits,
            addTenant,
            addTenants,
            addExpense,
            addRecurringExpense,
            addInvoice,
            addPayment,
            addMaintenance,
            updateSettings,
            getUnitsByProperty,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

