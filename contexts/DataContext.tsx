
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    Property, Tenant, Unit, Expense, Invoice, Payment, RecurringExpense, 
    Utility, MaintenanceRequest, PropertyGrouping, Message, TeamMember, 
    AuditLog, MpesaTransaction, Feedback 
} from '../types';
import { API_BASE_URL } from '../config';

interface BillingInfo {
    sms_balance: number;
    subscription_due: number;
    subscription_expiry: string;
}

interface DashboardStats {
    totalArrears: number;
    totalAdvance: number;
    tenantsArrearsCount: number;
    tenantsAdvanceCount: number;
    occupancyRate: number;
    totalUnits: number;
    occupiedUnits: number;
}

export interface FinancialChartData {
    name: string;
    monthIndex: number;
    payments: number;
    expenses: number;
    invoices: number;
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface DataContextType {
    isLoading: boolean;
    currentUser: TeamMember | null;
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
    mpesaTransactions: MpesaTransaction[];
    billing: BillingInfo;
    lastCreatedUnits: Unit[];
    dashboardStats: DashboardStats;
    financialChartData: FinancialChartData[];
    teamMembers: TeamMember[];
    auditLogs: AuditLog[];
    feedbacks: Feedback[];
    
    // Notifications
    notifications: Notification[];
    addNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
    removeNotification: (id: number) => void;

    // Property Actions
    addProperty: (property: Property) => Promise<Property | null>;
    updateProperty: (property: Property) => Promise<Property | null>;
    deleteProperty: (id: number) => void;
    editingProperty: Property | null;
    setEditingProperty: (property: Property | null) => void;

    // Unit Actions
    addUnit: (unit: Unit) => Promise<Unit | null>;
    addUnits: (units: Unit[]) => void;
    updateUnit: (unit: Unit) => void;
    deleteUnit: (id: number) => void;
    editingUnit: Unit | null;
    setEditingUnit: (unit: Unit | null) => void;

    // Tenant Actions
    addTenant: (tenant: Tenant) => Promise<Tenant | null>;
    addTenants: (tenants: Tenant[]) => void; 
    updateTenant: (tenant: Tenant) => Promise<Tenant | null>;
    deleteTenant: (id: number) => void;

    // Financial Actions
    addExpense: (expense: Expense) => void;
    updateExpense: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
    
    addRecurringExpense: (expense: RecurringExpense) => void;
    updateRecurringExpense: (expense: RecurringExpense) => void;
    deleteRecurringExpense: (id: number) => void;

    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
    deleteInvoice: (id: number) => void;

    addPayment: (payment: Payment) => Promise<boolean>;
    updatePayment: (payment: Payment) => void;
    deletePayment: (id: number) => void;
    
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
    addMessage: (message: Message) => Promise<boolean>;
    addMessages: (messages: Message[]) => void;
    updateMessage: (message: Message) => void;
    deleteMessage: (id: number) => void;

    // Team Actions
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (member: TeamMember) => void;
    deleteTeamMember: (id: number) => void;

    // Billing & MPESA Actions
    refreshBilling: () => void;
    topUpSms: (amount: number) => void;
    paySubscription: () => void;
    refreshMpesaTransactions: () => void;

    // System Actions
    performMaintenance: (action: 'prune_logs' | 'clear_cache') => Promise<void>;
    triggerSystemJob: (jobId: string) => Promise<void>;
    refreshFeedbacks: () => void;

    // File Actions
    uploadFile: (file: File, category?: string, metadata?: Record<string, any>) => Promise<{ success: boolean; url?: string; message?: string }>;

    // Helpers
    getUnitsByProperty: (propertyName: string) => Unit[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // App State
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);

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
    
    const [mpesaTransactions, setMpesaTransactions] = useState<MpesaTransaction[]>([]);
    const [billing, setBilling] = useState<BillingInfo>({ sms_balance: 0, subscription_due: 0, subscription_expiry: '' });
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        totalArrears: 0, totalAdvance: 0, tenantsArrearsCount: 0, 
        tenantsAdvanceCount: 0, occupancyRate: 0, totalUnits: 0, occupiedUnits: 0
    });
    const [financialChartData, setFinancialChartData] = useState<FinancialChartData[]>([]);
    
    // New Entities
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    const [lastCreatedUnits, setLastCreatedUnits] = useState<Unit[]>([]);
    
    // Notifications State
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Edit States
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [editingMaintenanceRequest, setEditingMaintenanceRequest] = useState<MaintenanceRequest | null>(null);
    const [editingPropertyGrouping, setEditingPropertyGrouping] = useState<PropertyGrouping | null>(null);

    // --- Notification Helpers ---
    const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // --- Helper: Auth Fetch with Retry & Error Handling ---
    const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 1, backoff = 300) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...(options.headers || {})
        };

        try {
            const response = await fetch(url, { ...options, headers });
            
            // 401 Unauthorized
            if (response.status === 401) {
                console.warn("Unauthorized request to", url);
                return null; 
            }

            // 403 Forbidden
            if (response.status === 403) {
                return null;
            }

            if (!response.ok) {
                // Return null on error, don't throw, to allow partial loading
                return null;
            }

            return response;

        } catch (error) {
            if (retries > 0) {
                await new Promise(r => setTimeout(r, backoff));
                return fetchWithRetry(url, options, retries - 1, backoff * 2);
            }
            console.error(`Fetch error for ${url}:`, error);
            return null;
        }
    };

    // --- Data Loading Logic ---
    const loadData = async (userRole: string) => {
        try {
            // Common Endpoints for all users
            const commonRequests = [
                fetchWithRetry(`${API_BASE_URL}/properties`),
                fetchWithRetry(`${API_BASE_URL}/units`),
                fetchWithRetry(`${API_BASE_URL}/tenants`),
                fetchWithRetry(`${API_BASE_URL}/invoices`),
                fetchWithRetry(`${API_BASE_URL}/payments`),
                fetchWithRetry(`${API_BASE_URL}/expenses`),
                fetchWithRetry(`${API_BASE_URL}/recurring-expenses`),
                fetchWithRetry(`${API_BASE_URL}/maintenance`),
                fetchWithRetry(`${API_BASE_URL}/utilities`),
                fetchWithRetry(`${API_BASE_URL}/property-groupings`),
                fetchWithRetry(`${API_BASE_URL}/messages`),
                fetchWithRetry(`${API_BASE_URL}/mpesa/transactions`),
                fetchWithRetry(`${API_BASE_URL}/billing`),
                fetchWithRetry(`${API_BASE_URL}/dashboard/stats`),
                fetchWithRetry(`${API_BASE_URL}/reports/financials/monthly`),
            ];

            const results = await Promise.all(commonRequests);

            const [
                propsRes, unitsRes, tenantsRes, invRes, payRes, expRes, recExpRes, 
                maintRes, utilRes, groupRes, msgRes, mpesaRes, billRes, statsRes, chartRes
            ] = results;

            if (propsRes) setProperties(await propsRes.json());
            if (unitsRes) setUnits(await unitsRes.json());
            if (tenantsRes) setTenants(await tenantsRes.json());
            if (invRes) setInvoices(await invRes.json());
            if (payRes) setPayments(await payRes.json());
            if (expRes) setExpenses(await expRes.json());
            if (recExpRes) setRecurringExpenses(await recExpRes.json());
            if (maintRes) setMaintenanceRequests(await maintRes.json());
            if (utilRes) setUtilities(await utilRes.json());
            if (groupRes) setPropertyGroupings(await groupRes.json());
            if (msgRes) setMessages(await msgRes.json());
            if (mpesaRes) setMpesaTransactions(await mpesaRes.json());
            if (billRes) setBilling(await billRes.json());
            if (statsRes) setDashboardStats(await statsRes.json());
            if (chartRes) setFinancialChartData(await chartRes.json());
            
            // Admin Only Endpoints
            if (userRole === 'Admin') {
                const [teamRes, auditRes, feedbackRes] = await Promise.all([
                    fetchWithRetry(`${API_BASE_URL}/team-members`),
                    fetchWithRetry(`${API_BASE_URL}/audit-logs`),
                    fetchWithRetry(`${API_BASE_URL}/feedback`)
                ]);
                
                if (teamRes) setTeamMembers(await teamRes.json());
                if (auditRes) setAuditLogs(await auditRes.json());
                if (feedbackRes) setFeedbacks(await feedbackRes.json());
            }

        } catch (error) {
            console.error("Failed to fetch data from backend", error);
            // Non-blocking error
        }
    };

    // --- Initialization ---
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            let role = '';

            try {
                if (token) {
                    // Try local first for immediate UI
                    const storedUser = localStorage.getItem('user');
                    if(storedUser) {
                        try {
                            const u = JSON.parse(storedUser);
                            setCurrentUser(u);
                            role = u.role;
                        } catch(e) {
                            console.error("Malformed user data in local storage");
                        }
                    }

                    // Attempt API verify
                    const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (meRes.ok) {
                        const user = await meRes.json();
                        setCurrentUser(user);
                        localStorage.setItem('user', JSON.stringify(user));
                        role = user.role;
                        
                        await loadData(role);
                    } else if (meRes.status === 401) {
                        // Token expired or invalid
                        console.warn("Session expired or invalid token.");
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setCurrentUser(null);
                    }
                }
            } catch (e) {
                console.error("Auth init connection error", e);
                // Even on error, if we have local user, assume offline mode and try to render
                if (role) await loadData(role);
            } finally {
                // ALWAYS turn off loading, ensure UI renders
                setIsLoading(false);
            }
        };

        init();
        
        // Absolute Failsafe: Ensure loading state is turned off after 5 seconds max
        const failsafe = setTimeout(() => setIsLoading(false), 5000);
        return () => clearTimeout(failsafe);
    }, []);

    // Exposed refresh function
    const refreshData = () => {
        if (currentUser) {
            loadData(currentUser.role);
        }
    };

    // -- Entity Actions --

    // Properties
    const addProperty = async (property: Property) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/properties`, { method: 'POST', body: JSON.stringify(property) });
        if (res) {
            const saved = await res.json();
            setProperties(prev => [...prev, saved]);
            addNotification('Property added successfully', 'success');
            refreshData();
            return saved;
        }
        return null;
    };
    const updateProperty = async (prop: Property) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/properties/${prop.id}`, { method: 'PUT', body: JSON.stringify(prop) });
        if (res) {
            const saved = await res.json();
            setProperties(prev => prev.map(p => p.id === saved.id ? saved : p));
            addNotification('Property updated', 'success');
            return saved;
        }
        return null;
    };
    const deleteProperty = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/properties/${id}`, { method: 'DELETE' });
        if (res) {
            setProperties(prev => prev.filter(p => p.id !== id));
            addNotification('Property deleted', 'info');
        }
    };

    // Units
    const addUnit = async (unit: Unit) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/units`, { method: 'POST', body: JSON.stringify(unit) });
        if (res) {
            const saved = await res.json();
            setUnits(prev => [...prev, saved]);
            setLastCreatedUnits([saved]);
            addNotification('Unit added', 'success');
            refreshData();
            return saved;
        }
        return null;
    };
    const addUnits = async (units: Unit[]) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/units`, { method: 'POST', body: JSON.stringify(units) });
        if (res) {
            const saved = await res.json();
            setUnits(prev => [...prev, ...saved]);
            setLastCreatedUnits(saved);
            addNotification(`${saved.length} units added`, 'success');
            refreshData();
        }
    };
    const updateUnit = async (unit: Unit) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/units/${unit.id}`, { method: 'PUT', body: JSON.stringify(unit) });
        if(res) {
            const saved = await res.json();
            setUnits(prev => prev.map(u => u.id === saved.id ? saved : u));
            addNotification('Unit updated', 'success');
        }
    };
    const deleteUnit = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/units/${id}`, { method: 'DELETE' });
        if(res) {
            setUnits(prev => prev.filter(u => u.id !== id));
            addNotification('Unit deleted', 'info');
        }
    };

    // Tenants
    const addTenant = async (tenant: Tenant) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/tenants`, { method: 'POST', body: JSON.stringify(tenant) });
        if(res) {
            const saved = await res.json();
            setTenants(prev => [...prev, saved]);
            setUnits(prev => prev.map(u => u.propertyName === saved.property && u.name === saved.unit ? { ...u, status: 'Occupied' } : u));
            addNotification('Tenant added', 'success');
            refreshData();
            return saved;
        }
        return null;
    };
    const addTenants = async (newTenants: Tenant[]) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/tenants`, { method: 'POST', body: JSON.stringify(newTenants) });
        if (res) {
            const saved = await res.json();
            setTenants(prev => [...prev, ...saved]);
            addNotification(`${saved.length} tenants imported`, 'success');
            refreshData();
        }
    };
    const updateTenant = async (tenant: Tenant) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/tenants/${tenant.id}`, { method: 'PUT', body: JSON.stringify(tenant) });
        if(res) {
            const saved = await res.json();
            setTenants(prev => prev.map(t => t.id === saved.id ? saved : t));
            addNotification('Tenant updated', 'success');
            refreshData();
            return saved;
        }
        return null;
    };
    const deleteTenant = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/tenants/${id}`, { method: 'DELETE' });
        if(res) {
            setTenants(prev => prev.filter(t => t.id !== id));
            addNotification('Tenant removed', 'info');
            refreshData(); 
        }
    };

    // Finance
    const addInvoice = async (invoice: Invoice) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/invoices`, { method: 'POST', body: JSON.stringify(invoice) });
        if(res) {
            const saved = await res.json();
            setInvoices(prev => [...prev, saved]);
            addNotification('Invoice created', 'success');
            refreshData(); 
        }
    };
    const updateInvoice = async (inv: Invoice) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/invoices/${inv.id}`, { method: 'PUT', body: JSON.stringify(inv) });
        if(res) {
            const saved = await res.json();
            setInvoices(prev => prev.map(i => i.id === saved.id ? saved : i));
            addNotification('Invoice updated', 'success');
        }
    };
    const deleteInvoice = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/invoices/${id}`, { method: 'DELETE' });
        if(res) {
            setInvoices(prev => prev.filter(i => i.id !== id));
            addNotification('Invoice deleted', 'info');
            refreshData(); 
        }
    };

    const addPayment = async (payment: Payment): Promise<boolean> => {
        const res = await fetchWithRetry(`${API_BASE_URL}/payments`, { method: 'POST', body: JSON.stringify(payment) });
        if(res) {
            const saved = await res.json();
            setPayments(prev => [...prev, saved]);
            addNotification('Payment recorded', 'success');
            refreshData(); 
            return true;
        }
        return false;
    };
    const updatePayment = async (payment: Payment) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/payments/${payment.id}`, { method: 'PUT', body: JSON.stringify(payment) });
        if(res) {
            const saved = await res.json();
            setPayments(prev => prev.map(p => p.id === saved.id ? saved : p));
            addNotification('Payment updated', 'success');
            refreshData(); 
        }
    };
    const deletePayment = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/payments/${id}`, { method: 'DELETE' });
        if(res) {
            setPayments(prev => prev.filter(p => p.id !== id));
            addNotification('Payment deleted', 'info');
            refreshData(); 
        }
    };

    const addExpense = async (expense: Expense) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/expenses`, { method: 'POST', body: JSON.stringify(expense) });
        if(res) {
            const saved = await res.json();
            setExpenses(prev => [...prev, saved]);
            addNotification('Expense recorded', 'success');
        }
    };
    const updateExpense = async (exp: Expense) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/expenses/${exp.id}`, { method: 'PUT', body: JSON.stringify(exp) });
        if (res) {
            const saved = await res.json();
            setExpenses(prev => prev.map(e => e.id === saved.id ? saved : e));
            addNotification('Expense updated', 'success');
        }
    };
    const deleteExpense = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/expenses/${id}`, { method: 'DELETE' });
        if(res) {
            setExpenses(prev => prev.filter(e => e.id !== id));
            addNotification('Expense deleted', 'info');
        }
    };

    // Recurring
    const addRecurringExpense = async (expense: RecurringExpense) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/recurring-expenses`, { method: 'POST', body: JSON.stringify(expense) });
        if(res) {
            const saved = await res.json();
            setRecurringExpenses(prev => [...prev, saved]);
            addNotification('Recurring expense created', 'success');
        }
    };
    const updateRecurringExpense = async (exp: RecurringExpense) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/recurring-expenses/${exp.id}`, { method: 'PUT', body: JSON.stringify(exp) });
        if(res) {
            const saved = await res.json();
            setRecurringExpenses(prev => prev.map(e => e.id === saved.id ? saved : e));
            addNotification(`Recurring expense updated`, 'info');
        }
    };
    const deleteRecurringExpense = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/recurring-expenses/${id}`, { method: 'DELETE' });
        if(res) {
            setRecurringExpenses(prev => prev.filter(e => e.id !== id));
            addNotification('Recurring expense deleted', 'info');
        }
    };

    // Other Actions
    const addUtility = async (utility: Utility) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/utilities`, { method: 'POST', body: JSON.stringify(utility) });
        if(res) {
            const saved = await res.json();
            setUtilities(prev => [...prev, saved]);
            addNotification('Utility recorded', 'success');
        }
    };
    const updateUtility = async (utility: Utility) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/utilities/${utility.id}`, { method: 'PUT', body: JSON.stringify(utility) });
        if(res) {
            const saved = await res.json();
            setUtilities(prev => prev.map(u => u.id === saved.id ? saved : u));
        }
    };
    const deleteUtility = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/utilities/${id}`, { method: 'DELETE' });
        if(res) {
            setUtilities(prev => prev.filter(u => u.id !== id));
            addNotification('Utility deleted', 'info');
        }
    };

    const addMaintenanceRequest = async (req: MaintenanceRequest) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/maintenance`, { method: 'POST', body: JSON.stringify(req) });
        if(res) {
            const saved = await res.json();
            setMaintenanceRequests(prev => [...prev, saved]);
            addNotification('Request created', 'success');
        }
    };
    const updateMaintenanceRequest = async (req: MaintenanceRequest) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/maintenance/${req.id}`, { method: 'PUT', body: JSON.stringify(req) });
        if(res) {
            const saved = await res.json();
            setMaintenanceRequests(prev => prev.map(r => r.id === saved.id ? saved : r));
            addNotification('Request updated', 'success');
        }
    };
    const deleteMaintenanceRequest = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/maintenance/${id}`, { method: 'DELETE' });
        if(res) {
            setMaintenanceRequests(prev => prev.filter(r => r.id !== id));
            addNotification('Request deleted', 'info');
        }
    };

    const addPropertyGrouping = async (group: PropertyGrouping) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/property-groupings`, { method: 'POST', body: JSON.stringify(group) });
        if(res) {
            const saved = await res.json();
            setPropertyGroupings(prev => [...prev, saved]);
            addNotification('Group created', 'success');
        }
    };
    const updatePropertyGrouping = async (group: PropertyGrouping) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/property-groupings/${group.id}`, { method: 'PUT', body: JSON.stringify(group) });
        if(res) {
            const saved = await res.json();
            setPropertyGroupings(prev => prev.map(g => g.id === saved.id ? saved : g));
            addNotification('Group updated', 'success');
        }
    };
    const deletePropertyGrouping = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/property-groupings/${id}`, { method: 'DELETE' });
        if(res) {
            setPropertyGroupings(prev => prev.filter(g => g.id !== id));
            addNotification('Group deleted', 'info');
        }
    };

    const addMessage = async (message: Message): Promise<boolean> => {
        try {
            const res = await fetchWithRetry(`${API_BASE_URL}/messages/send`, { method: 'POST', body: JSON.stringify(message) });
            if(res && res.ok) {
                const data = await res.json();
                setMessages(prev => [data.data, ...prev]);
                if (data.new_balance !== undefined) setBilling(prev => ({ ...prev, sms_balance: data.new_balance }));
                addNotification('Message sent successfully', 'success');
                return true;
            } else {
                return false;
            }
        } catch(e) { 
            return false;
        }
    };
    const addMessages = async (msgs: Message[]) => { for(const msg of msgs) await addMessage(msg); };

    const updateMessage = async (message: Message) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/messages/${message.id}`, { method: 'PUT', body: JSON.stringify(message) });
        if(res) {
            const saved = await res.json();
            setMessages(prev => prev.map(m => m.id === saved.id ? saved : m));
            addNotification('Message updated', 'info');
        }
    };

    const deleteMessage = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/messages/${id}`, { method: 'DELETE' });
        if(res) {
            setMessages(prev => prev.filter(m => m.id !== id));
            addNotification('Message deleted', 'info');
        }
    };

    // --- Team Actions ---
    const addTeamMember = async (member: TeamMember) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/team-members`, { method: 'POST', body: JSON.stringify(member) });
        if(res) {
            const saved = await res.json();
            setTeamMembers(prev => [...prev, saved]);
            addNotification('Team member added', 'success');
        }
    };
    const updateTeamMember = async (member: TeamMember) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/team-members/${member.id}`, { method: 'PUT', body: JSON.stringify(member) });
        if(res) {
            const saved = await res.json();
            setTeamMembers(prev => prev.map(m => m.id === saved.id ? saved : m));
            addNotification('Team member updated', 'success');
        }
    };
    const deleteTeamMember = async (id: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/team-members/${id}`, { method: 'DELETE' });
        if(res) {
            setTeamMembers(prev => prev.filter(m => m.id !== id));
            addNotification('Team member deleted', 'info');
        }
    };

    // --- System Actions ---
    const performMaintenance = async (action: 'prune_logs' | 'clear_cache') => {
        const res = await fetchWithRetry(`${API_BASE_URL}/system/maintenance`, { method: 'POST', body: JSON.stringify({ action }) });
        if (res && res.ok) {
            const data = await res.json();
            addNotification(data.message, 'success');
            if (action === 'prune_logs') {
                const auditRes = await fetchWithRetry(`${API_BASE_URL}/audit-logs`);
                if(auditRes) setAuditLogs(await auditRes.json());
            }
        }
    };

    const triggerSystemJob = async (jobId: string) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/system/jobs/trigger`, { 
            method: 'POST', 
            body: JSON.stringify({ job_id: jobId }) 
        });
        
        if (res && res.ok) {
            const data = await res.json();
            addNotification(data.message, 'success');
            refreshData(); 
        }
    };

    const refreshFeedbacks = async () => {
        const res = await fetchWithRetry(`${API_BASE_URL}/feedback`);
        if (res) setFeedbacks(await res.json());
    };

    // --- Helpers ---
    const refreshBilling = async () => {
        const res = await fetchWithRetry(`${API_BASE_URL}/billing`);
        if (res) setBilling(await res.json());
    };
    const topUpSms = async (amount: number) => {
        const res = await fetchWithRetry(`${API_BASE_URL}/billing/topup`, { method: 'POST', body: JSON.stringify({ item: 'sms', amount }) });
        if (res) {
            const data = await res.json();
            setBilling(prev => ({ ...prev, sms_balance: data.new_balance }));
            addNotification('SMS Topup Successful', 'success');
        }
    };
    const paySubscription = async () => {
        const res = await fetchWithRetry(`${API_BASE_URL}/billing/topup`, { method: 'POST', body: JSON.stringify({ item: 'subscription' }) });
        if (res) {
            const data = await res.json();
            setBilling(prev => ({ ...prev, subscription_expiry: data.new_expiry, subscription_due: 0 }));
            addNotification('Subscription Paid', 'success');
        }
    };
    const refreshMpesaTransactions = async () => {
        const res = await fetchWithRetry(`${API_BASE_URL}/mpesa/transactions`);
        if (res) setMpesaTransactions(await res.json());
    };

    const uploadFile = async (file: File, category: string = 'general', metadata: Record<string, any> = {}): Promise<{ success: boolean; url?: string; message?: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        
        Object.keys(metadata).forEach(key => {
            if (metadata[key]) {
                formData.append(key, metadata[key].toString());
            }
        });

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/files/upload`, {
                method: 'POST',
                headers: { 'Authorization': token ? `Bearer ${token}` : '' },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                addNotification('Upload successful', 'success');
                return { success: true, url: data.url, message: data.message };
            } else {
                addNotification(data.error || 'Upload failed', 'error');
                return { success: false, message: data.error };
            }
        } catch (e) {
            addNotification('Network error during upload', 'error');
            return { success: false, message: "Network error during upload" };
        }
    };

    const getUnitsByProperty = (propertyName: string) => units.filter(u => u.propertyName === propertyName);

    return (
        <DataContext.Provider value={{
            isLoading,
            currentUser,
            properties, tenants, units, expenses, recurringExpenses, invoices, payments,
            utilities, maintenanceRequests, propertyGroupings, messages, lastCreatedUnits,
            mpesaTransactions, billing, dashboardStats, financialChartData, teamMembers, auditLogs,
            feedbacks, notifications, addNotification, removeNotification,
            addProperty, updateProperty, deleteProperty, editingProperty, setEditingProperty,
            addUnit, addUnits, updateUnit, deleteUnit, editingUnit, setEditingUnit,
            addTenant, addTenants, updateTenant, deleteTenant,
            addExpense, updateExpense, deleteExpense, addRecurringExpense, updateRecurringExpense, deleteRecurringExpense,
            addInvoice, updateInvoice, deleteInvoice, addPayment, updatePayment, deletePayment,
            addUtility, updateUtility, deleteUtility,
            addMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest, editingMaintenanceRequest, setEditingMaintenanceRequest,
            addPropertyGrouping, updatePropertyGrouping, deletePropertyGrouping, editingPropertyGrouping, setEditingPropertyGrouping,
            addMessage, addMessages, updateMessage, deleteMessage,
            addTeamMember, updateTeamMember, deleteTeamMember,
            performMaintenance, triggerSystemJob, refreshFeedbacks,
            refreshBilling, topUpSms, paySubscription, refreshMpesaTransactions, uploadFile, getUnitsByProperty
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error('useData must be used within a DataProvider');
    return context;
};
