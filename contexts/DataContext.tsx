
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Tenant, Unit, Expense, Invoice, Payment, RecurringExpense, Utility, MaintenanceRequest, PropertyGrouping, Message } from '../types';

interface DataContextType {
    properties: Property[];
    tenants: Tenant[];
    units: Unit[];
    expenses: Expense[];
    recurringExpenses: RecurringExpense[];
    invoices: Invoice[];
    payments: Payment[];
    utilities: Utility[];
    maintenanceRequests: MaintenanceRequest[];
    propertyGroupings: PropertyGrouping[];
    messages: Message[];
    lastCreatedUnits: Unit[];
    
    // Property Actions
    addProperty: (property: Property) => void;
    updateProperty: (property: Property) => void;
    deleteProperty: (id: number) => void;
    editingProperty: Property | null;
    setEditingProperty: (property: Property | null) => void;

    // Unit Actions
    addUnit: (unit: Unit) => void;
    addUnits: (units: Unit[]) => void;
    updateUnit: (unit: Unit) => void;
    deleteUnit: (id: number) => void;
    editingUnit: Unit | null;
    setEditingUnit: (unit: Unit | null) => void;

    // Tenant Actions
    addTenant: (tenant: Tenant) => void;
    addTenants: (tenants: Tenant[]) => void; 
    deleteTenant: (id: number) => void;

    // Financial Actions
    addExpense: (expense: Expense) => void;
    addRecurringExpense: (expense: RecurringExpense) => void;
    addInvoice: (invoice: Invoice) => void;
    addPayment: (payment: Payment) => void;
    
    // Utility Actions
    addUtility: (utility: Utility) => void;
    updateUtility: (utility: Utility) => void;
    deleteUtility: (id: number) => void;

    // Maintenance Actions
    addMaintenanceRequest: (request: MaintenanceRequest) => void;
    updateMaintenanceRequest: (request: MaintenanceRequest) => void;
    deleteMaintenanceRequest: (id: number) => void;
    editingMaintenanceRequest: MaintenanceRequest | null;
    setEditingMaintenanceRequest: (request: MaintenanceRequest | null) => void;

    // Grouping Actions
    addPropertyGrouping: (group: PropertyGrouping) => void;
    updatePropertyGrouping: (group: PropertyGrouping) => void;
    deletePropertyGrouping: (id: number) => void;
    editingPropertyGrouping: PropertyGrouping | null;
    setEditingPropertyGrouping: (group: PropertyGrouping | null) => void;

    // Message Actions
    addMessage: (message: Message) => void;
    addMessages: (messages: Message[]) => void;

    // Helpers
    getUnitsByProperty: (propertyName: string) => Unit[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Data State
    const [properties, setProperties] = useState<Property[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [utilities, setUtilities] = useState<Utility[]>([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
    const [propertyGroupings, setPropertyGroupings] = useState<PropertyGrouping[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    
    const [lastCreatedUnits, setLastCreatedUnits] = useState<Unit[]>([]);
    
    // Edit States
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [editingMaintenanceRequest, setEditingMaintenanceRequest] = useState<MaintenanceRequest | null>(null);
    const [editingPropertyGrouping, setEditingPropertyGrouping] = useState<PropertyGrouping | null>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const propsRes = await fetch(`${API_BASE}/properties`);
                if (propsRes.ok) setProperties(await propsRes.json());

                const unitsRes = await fetch(`${API_BASE}/units`);
                if (unitsRes.ok) setUnits(await unitsRes.json());

                const tenantsRes = await fetch(`${API_BASE}/tenants`);
                if (tenantsRes.ok) setTenants(await tenantsRes.json());

                const invRes = await fetch(`${API_BASE}/invoices`);
                if (invRes.ok) setInvoices(await invRes.json());

                const payRes = await fetch(`${API_BASE}/payments`);
                if (payRes.ok) setPayments(await payRes.json());

                const expRes = await fetch(`${API_BASE}/expenses`);
                if (expRes.ok) setExpenses(await expRes.json());

                const maintRes = await fetch(`${API_BASE}/maintenance`);
                if (maintRes.ok) setMaintenanceRequests(await maintRes.json());

                const utilRes = await fetch(`${API_BASE}/utilities`);
                if (utilRes.ok) setUtilities(await utilRes.json());

            } catch (error) {
                console.error("Failed to fetch data from backend", error);
            }
        };
        fetchData();
    }, []);

    // -- Property Actions --
    const addProperty = async (property: Property) => {
        try {
            const res = await fetch(`${API_BASE}/properties`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(property)
            });
            if (res.ok) {
                const saved = await res.json();
                setProperties([...properties, saved]);
            }
        } catch(e) { console.error(e); }
    };

    const updateProperty = async (updatedProperty: Property) => {
        try {
            const res = await fetch(`${API_BASE}/properties/${updatedProperty.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProperty)
            });
            if (res.ok) {
                const saved = await res.json();
                setProperties(properties.map(p => p.id === saved.id ? saved : p));
            }
        } catch(e) { console.error(e); }
    };

    const deleteProperty = async (id: number) => {
        try {
            await fetch(`${API_BASE}/properties/${id}`, { method: 'DELETE' });
            setProperties(properties.filter(p => p.id !== id));
        } catch(e) { console.error(e); }
    };

    // -- Unit Actions --
    const addUnit = async (unit: Unit) => {
        try {
            const res = await fetch(`${API_BASE}/units`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unit)
            });
            if (res.ok) {
                const saved = await res.json();
                setUnits(prev => [...prev, saved]);
                setLastCreatedUnits([saved]);
            }
        } catch(e) { console.error(e); }
    };

    const addUnits = async (newUnits: Unit[]) => {
        try {
            const res = await fetch(`${API_BASE}/units`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUnits)
            });
            if (res.ok) {
                const saved = await res.json();
                setUnits(prev => [...prev, ...saved]);
                setLastCreatedUnits(saved);
            }
        } catch(e) { console.error(e); }
    };

    const updateUnit = async (updatedUnit: Unit) => {
        try {
            const res = await fetch(`${API_BASE}/units/${updatedUnit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUnit)
            });
            if(res.ok) {
                const saved = await res.json();
                setUnits(units.map(u => u.id === saved.id ? saved : u));
            }
        } catch(e) { console.error(e); }
    };

    const deleteUnit = async (id: number) => {
        try {
            await fetch(`${API_BASE}/units/${id}`, { method: 'DELETE' });
            setUnits(units.filter(u => u.id !== id));
        } catch(e) { console.error(e); }
    };

    // -- Tenant Actions --
    const addTenant = async (tenant: Tenant) => {
        try {
            const res = await fetch(`${API_BASE}/tenants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tenant)
            });
            if(res.ok) {
                const saved = await res.json();
                setTenants([...tenants, saved]);
                // Optimistically update unit occupancy locally
                setUnits(units.map(u => 
                    u.propertyName === saved.property && u.name === saved.unit 
                        ? { ...u, status: 'Occupied' } 
                        : u
                ));
            }
        } catch(e) { console.error(e); }
    };

    const addTenants = async (newTenants: Tenant[]) => {
        try {
            const res = await fetch(`${API_BASE}/tenants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTenants)
            });
            if (res.ok) {
                const saved = await res.json();
                setTenants([...tenants, ...saved]);
            }
        } catch(e) { console.error(e); }
    };

    const deleteTenant = async (id: number) => {
        try {
            await fetch(`${API_BASE}/tenants/${id}`, { method: 'DELETE' });
            const tenant = tenants.find(t => t.id === id);
            if(tenant) {
                setUnits(units.map(u => 
                    u.propertyName === tenant.property && u.name === tenant.unit 
                        ? { ...u, status: 'Vacant' } 
                        : u
                ));
                setTenants(prev => prev.filter(t => t.id !== id));
            }
        } catch(e) { console.error(e); }
    };

    // -- Financial Actions --
    const addExpense = async (expense: Expense) => {
        try {
            const res = await fetch(`${API_BASE}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });
            if(res.ok) {
                const saved = await res.json();
                setExpenses([...expenses, saved]);
            }
        } catch(e) { console.error(e); }
    };

    const addRecurringExpense = (expense: RecurringExpense) => {
        // Mock only for now as no backend endpoint defined in basic setup
        setRecurringExpenses([...recurringExpenses, expense]);
    };

    const addInvoice = async (invoice: Invoice) => {
        try {
            const res = await fetch(`${API_BASE}/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoice)
            });
            if(res.ok) {
                const saved = await res.json();
                setInvoices([...invoices, saved]);
            }
        } catch(e) { console.error(e); }
    };

    const addPayment = async (payment: Payment) => {
        try {
            const res = await fetch(`${API_BASE}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payment)
            });
            if(res.ok) {
                const saved = await res.json();
                setPayments([...payments, saved]);
            }
        } catch(e) { console.error(e); }
    };

    // -- Utility Actions --
    const addUtility = async (utility: Utility) => {
        try {
            const res = await fetch(`${API_BASE}/utilities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(utility)
            });
            if(res.ok) {
                const saved = await res.json();
                setUtilities([...utilities, saved]);
            }
        } catch(e) { console.error(e); }
    };

    const updateUtility = async (updatedUtility: Utility) => {
        try {
            const res = await fetch(`${API_BASE}/utilities/${updatedUtility.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUtility)
            });
            if(res.ok) {
                const saved = await res.json();
                setUtilities(utilities.map(u => u.id === saved.id ? saved : u));
            }
        } catch(e) { console.error(e); }
    };

    const deleteUtility = (id: number) => {
        // Mock only
        setUtilities(utilities.filter(u => u.id !== id));
    };

    // -- Maintenance Actions --
    const addMaintenanceRequest = async (request: MaintenanceRequest) => {
        try {
            const res = await fetch(`${API_BASE}/maintenance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            if(res.ok) {
                const saved = await res.json();
                setMaintenanceRequests([...maintenanceRequests, saved]);
            }
        } catch(e) { console.error(e); }
    };

    const updateMaintenanceRequest = async (updatedRequest: MaintenanceRequest) => {
        try {
            const res = await fetch(`${API_BASE}/maintenance/${updatedRequest.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRequest)
            });
            if(res.ok) {
                const saved = await res.json();
                setMaintenanceRequests(maintenanceRequests.map(r => r.id === saved.id ? saved : r));
            }
        } catch(e) { console.error(e); }
    };

    const deleteMaintenanceRequest = (id: number) => {
        setMaintenanceRequests(maintenanceRequests.filter(r => r.id !== id));
    };

    // -- Grouping Actions (Mocked for now) --
    const addPropertyGrouping = (group: PropertyGrouping) => {
        setPropertyGroupings([...propertyGroupings, group]);
    };

    const updatePropertyGrouping = (updatedGroup: PropertyGrouping) => {
        setPropertyGroupings(propertyGroupings.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    };

    const deletePropertyGrouping = (id: number) => {
        setPropertyGroupings(propertyGroupings.filter(g => g.id !== id));
    };

    // -- Message Actions (Mocked) --
    const addMessage = (message: Message) => {
        setMessages([message, ...messages]);
    };

    const addMessages = (newMessages: Message[]) => {
        setMessages([...newMessages, ...messages]);
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
            utilities,
            maintenanceRequests,
            propertyGroupings,
            messages,
            lastCreatedUnits,
            // Property
            addProperty,
            updateProperty,
            deleteProperty,
            editingProperty,
            setEditingProperty,
            // Unit
            addUnit,
            addUnits,
            updateUnit,
            deleteUnit,
            editingUnit,
            setEditingUnit,
            // Tenant
            addTenant,
            addTenants,
            deleteTenant,
            // Financial
            addExpense,
            addRecurringExpense,
            addInvoice,
            addPayment,
            // Utility
            addUtility,
            updateUtility,
            deleteUtility,
            // Maintenance
            addMaintenanceRequest,
            updateMaintenanceRequest,
            deleteMaintenanceRequest,
            editingMaintenanceRequest,
            setEditingMaintenanceRequest,
            // Grouping
            addPropertyGrouping,
            updatePropertyGrouping,
            deletePropertyGrouping,
            editingPropertyGrouping,
            setEditingPropertyGrouping,
            // Messages
            addMessage,
            addMessages,
            
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
