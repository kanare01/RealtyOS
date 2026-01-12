
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Tenant, Unit, Expense, Invoice, Payment, RecurringExpense } from '../types';

// Helper hook for LocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

interface DataContextType {
    properties: Property[];
    tenants: Tenant[];
    units: Unit[];
    expenses: Expense[];
    recurringExpenses: RecurringExpense[];
    invoices: Invoice[];
    payments: Payment[];
    lastCreatedUnits: Unit[]; // Store temporarily for bulk add flow
    addProperty: (property: Property) => void;
    addUnit: (unit: Unit) => void;
    addUnits: (units: Unit[]) => void;
    addTenant: (tenant: Tenant) => void;
    addTenants: (tenants: Tenant[]) => void; // Bulk add
    addExpense: (expense: Expense) => void;
    addRecurringExpense: (expense: RecurringExpense) => void;
    addInvoice: (invoice: Invoice) => void;
    addPayment: (payment: Payment) => void;
    getUnitsByProperty: (propertyName: string) => Unit[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [properties, setProperties] = useLocalStorage<Property[]>('realtyos_properties', []);
    const [tenants, setTenants] = useLocalStorage<Tenant[]>('realtyos_tenants', []);
    const [units, setUnits] = useLocalStorage<Unit[]>('realtyos_units', []);
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('realtyos_expenses', []);
    const [recurringExpenses, setRecurringExpenses] = useLocalStorage<RecurringExpense[]>('realtyos_recurring_expenses', []);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>('realtyos_invoices', []);
    const [payments, setPayments] = useLocalStorage<Payment[]>('realtyos_payments', []);
    const [lastCreatedUnits, setLastCreatedUnits] = useState<Unit[]>([]);

    // Sync unit occupancy when tenants change
    useEffect(() => {
        if (properties.length === 0) return;
        
        const updatedProperties = properties.map(prop => {
            const propUnits = units.filter(u => u.propertyName === prop.name);
            const totalUnits = propUnits.length;
            const occupiedUnits = propUnits.filter(u => u.status === 'Occupied').length;
            const occupancy = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
            return { ...prop, units: totalUnits, occupancy };
        });
        
        // Simple check to avoid infinite loop - only update if values changed
        const currentString = JSON.stringify(properties);
        const newString = JSON.stringify(updatedProperties);
        if (currentString !== newString) {
            setProperties(updatedProperties);
        }
    }, [units, tenants]);

    const addProperty = (property: Property) => {
        setProperties([...properties, property]);
    };

    const addUnit = (unit: Unit) => {
        setUnits((prev) => [...prev, unit]);
        setLastCreatedUnits([unit]);
    };

    const addUnits = (newUnits: Unit[]) => {
        setUnits((prev) => [...prev, ...newUnits]);
        setLastCreatedUnits(newUnits);
    };

    const addTenant = (tenant: Tenant) => {
        setTenants([...tenants, tenant]);
        // Auto-occupy unit
        setUnits(units.map(u => 
            u.propertyName === tenant.property && u.name === tenant.unit 
                ? { ...u, status: 'Occupied' } 
                : u
        ));
    };

    const addTenants = (newTenants: Tenant[]) => {
        setTenants([...tenants, ...newTenants]);
        
        // Update occupancy for multiple units
        const occupiedKeys = new Set(newTenants.map(t => `${t.property}_${t.unit}`));
        
        setUnits(units.map(u => 
            occupiedKeys.has(`${u.propertyName}_${u.name}`)
                ? { ...u, status: 'Occupied' } 
                : u
        ));
    };

    const addExpense = (expense: Expense) => {
        setExpenses([...expenses, expense]);
    };

    const addRecurringExpense = (expense: RecurringExpense) => {
        setRecurringExpenses([...recurringExpenses, expense]);
    };

    const addInvoice = (invoice: Invoice) => {
        setInvoices([...invoices, invoice]);
    };

    const addPayment = (payment: Payment) => {
        setPayments([...payments, payment]);
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
            lastCreatedUnits,
            addProperty,
            addUnit,
            addUnits,
            addTenant,
            addTenants,
            addExpense,
            addRecurringExpense,
            addInvoice,
            addPayment,
            getUnitsByProperty
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
