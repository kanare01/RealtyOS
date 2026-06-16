import React, { useState, useEffect } from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';
import ErdDiagram from './ErdDiagram';
import ApiContract from './ApiContract';
import SecurityModel from './SecurityModel';
import TechStack from './TechStack';

interface CoTenant {
  name: string;
  relationship: string;
}

interface Lease {
  id: number;
  tenantName: string;
  unitName: string;
  startDate: string;
  endDate: string;
  status: string;
  rentEscalationPercentage: number;
  securityDepositAmount: number;
  guarantorName?: string;
}

interface Account {
  code: string;
  name: string;
  type: string;
  balance: number;
}

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  lines: { accountCode: string; accountName: string; debit: number; credit: number }[];
}

interface MpesaTransaction {
  id: string;
  phoneNumber: string;
  amount: number;
  mpesaReceiptNumber: string;
  status: string;
  timestamp: string;
  tenantName: string;
}

interface Inspection {
  id: number;
  propertyName: string;
  unitName: string;
  type: string;
  date: string;
  inspector: string;
  status: string;
  notes: string;
}

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

const FoundationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'erd' | 'api' | 'security' | 'tech' | 'sandbox'>('architecture');
  const [sandboxSubTab, setSandboxSubTab] = useState<'mpesa' | 'leases' | 'accounting' | 'inspections' | 'ocr' | 'audit'>('mpesa');

  // Sandbox data from backend
  const [leases, setLeases] = useState<Lease[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [mpesaTransactions, setMpesaTransactions] = useState<MpesaTransaction[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Form states
  const [mpesaPhone, setMpesaPhone] = useState('254712345678');
  const [mpesaAmount, setMpesaAmount] = useState('25000');
  const [mpesaReceipt, setMpesaReceipt] = useState(`QY${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  const [mpesaMessage, setMpesaMessage] = useState<{ status: 'success' | 'error', text: string } | null>(null);

  // Lease form states
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [leaseStart, setLeaseStart] = useState('2024-06-01');
  const [leaseEnd, setLeaseEnd] = useState('2025-05-31');
  const [rentEscalation, setRentEscalation] = useState('10');
  const [securityDep, setSecurityDep] = useState('25000');
  const [guarantor, setGuarantor] = useState('');
  const [leaseMessage, setLeaseMessage] = useState<{ status: 'success' | 'error', text: string } | null>(null);

  // Accounts list from backend
  const [availableTenants, setAvailableTenants] = useState<any[]>([]);
  const [availableUnits, setAvailableUnits] = useState<any[]>([]);

  // OCR state
  const [ocrText, setOcrText] = useState(`LEASE AGREEMENT
This agreement is entered on 2024-06-12 between Sunshine Real Estate Group and David Kimani.
RENT DETAILS:
The rent amount shall be KES 35,000 per calendar month.
The tenant agrees to transfer a security deposit of KES 35,000.
Escalation rate is locked at 12% per annum beginning on any renewal cycle.
Authorized Signatures detected: SIGNED.`);
  const [ocrResult, setOcrResult] = useState<any | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // Manual Ledger State
  const [manualRef, setManualRef] = useState('ADJ-TAX-24');
  const [manualDesc, setManualDesc] = useState('Quarterly rental taxation accrual');
  const [manualLines, setManualLines] = useState([
    { accountCode: '1020', accountName: 'Accounts Receivable', debit: '12000', credit: '0' },
    { accountCode: '4010', accountName: 'Rental Revenue', debit: '0', credit: '12000' }
  ]);
  const [ledgerMessage, setLedgerMessage] = useState<{ status: 'success' | 'error', text: string } | null>(null);

  // Inspection states
  const [inspectProperty, setInspectProperty] = useState('Sunshine Apartments');
  const [inspectUnit, setInspectUnit] = useState('A3');
  const [inspectType, setInspectType] = useState('Move-In');
  const [inspectNotes, setInspectNotes] = useState('All water faucets flows check out. Light bulbs active.');
  const [inspectionMessage, setInspectionMessage] = useState<{ status: 'success' | 'error', text: string } | null>(null);

  const fetchSandboxData = async () => {
    try {
      const respData = await fetch('/api/data');
      if (respData.ok) {
        const payload = await respData.json();
        setAvailableTenants(payload.tenants || []);
        setAvailableUnits(payload.units || []);
        if (payload.tenants && payload.tenants.length > 0) setSelectedTenantId(payload.tenants[0].id.toString());
        if (payload.units && payload.units.length > 0) setSelectedUnitId(payload.units[0].id.toString());
      }

      const resLease = await fetch('/api/leases');
      if (resLease.ok) setLeases(await resLease.json());

      const resCoa = await fetch('/api/chart-of-accounts');
      if (resCoa.ok) setAccounts(await resCoa.json());

      const resJe = await fetch('/api/journal-entries');
      if (resJe.ok) setJournals(await resJe.json());

      const resTx = await fetch('/api/mpesa/transactions');
      if (resTx.ok) setMpesaTransactions(await resTx.json());

      const resIns = await fetch('/api/inspections');
      if (resIns.ok) setInspections(await resIns.json());

      const resAudit = await fetch('/api/audit-trail');
      if (resAudit.ok) setAuditLogs(await resAudit.json());

    } catch (err) {
      console.error("Failed to load sandbox records", err);
    }
  };

  useEffect(() => {
    fetchSandboxData();
  }, []);

  // Submit Simulated MPESA Paybill Webhook callback
  const handleSimulateMpesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setMpesaMessage(null);
    try {
      const response = await fetch('/api/mpesa/c2b-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: mpesaPhone,
          amount: mpesaAmount,
          mpesaReceiptNumber: mpesaReceipt,
          tenantId: selectedTenantId
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        setMpesaMessage({ status: 'error', text: resData.error || 'Failed to simulate M-PESA.' });
      } else {
        setMpesaMessage({ status: 'success', text: `Cleared perfectly. Matched ${resData.tenantMatched}. Simulated ${resData.invoiceSettlements} invoices FIFO payoff.` });
        setMpesaReceipt(`QY${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
        fetchSandboxData();
      }
    } catch (err) {
      setMpesaMessage({ status: 'error', text: 'Connection timed out.' });
    }
  };

  // Create Lease agreement manually
  const handleCreateLease = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeaseMessage(null);
    try {
      const response = await fetch('/api/leases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: selectedTenantId,
          unitId: selectedUnitId,
          startDate: leaseStart,
          endDate: leaseEnd,
          rentEscalationPercentage: rentEscalation,
          securityDepositAmount: securityDep,
          guarantorName: guarantor,
          coTenants: []
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        setLeaseMessage({ status: 'error', text: resData.error || 'Failed to save lease lease.' });
      } else {
        setLeaseMessage({ status: 'success', text: `Lease generated of ID #${resData.id} for ${resData.tenantName}. Tenant deposit KES ${resData.securityDepositAmount} moved to double-entry escrow liability.` });
        fetchSandboxData();
      }
    } catch (err) {
      setLeaseMessage({ status: 'error', text: 'Error executing transaction.' });
    }
  };

  const handleManualJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLedgerMessage(null);
    try {
      const formattedLines = manualLines.map(line => ({
        accountCode: line.accountCode,
        accountName: accounts.find(a => a.code === line.accountCode)?.name || 'Unknown',
        debit: parseFloat(line.debit) || 0,
        credit: parseFloat(line.credit) || 0
      }));

      const response = await fetch('/api/journal-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: manualRef,
          description: manualDesc,
          lines: formattedLines
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        setLedgerMessage({ status: 'error', text: resData.error || 'Accrual math mismatch.' });
      } else {
        setLedgerMessage({ status: 'success', text: `Accrual Journal Entry successfully posted. General ledgers and accounting records balanced perfectly.` });
        fetchSandboxData();
      }
    } catch (err) {
      setLedgerMessage({ status: 'error', text: 'Error posting journal details.' });
    }
  };

  // Simulate AI OCR
  const handleOcrAnalyze = async () => {
    setOcrLoading(true);
    setOcrResult(null);
    try {
      const response = await fetch('/api/ocr/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textToAnalyze: ocrText, fileName: 'lease_agreement_contract.txt' })
      });
      const res = await response.json();
      setOcrResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setOcrLoading(false);
    }
  };

  // Inspections Log
  const handleInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInspectionMessage(null);
    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyName: inspectProperty,
          unitName: inspectUnit,
          type: inspectType,
          notes: inspectNotes
        })
      });
      const resData = await response.json();
      if (!response.ok) {
        setInspectionMessage({ status: 'error', text: resData.error || 'Failed to file audit.' });
      } else {
        setInspectionMessage({ status: 'success', text: `Inspection audit successfully published under Unit ${resData.unitName}.` });
        fetchSandboxData();
      }
    } catch (err) {
      setInspectionMessage({ status: 'error', text: 'Error recording inspections.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 p-6 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">System Governance Hub</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            RealtyOS Enterprise Foundation Portal
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Platform design patterns audit, API contract standards, schema entity relationship maps, and fully functional multi-tenant mock-database controller.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900 border border-gray-800 rounded-lg py-2 px-3">
          <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>Enterprise Services Balanced Ledger</span>
        </div>
      </div>

      {/* Primary Navigation System */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-850 pb-4">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-2 px-4 rounded-lg font-medium text-xs transition-all duration-200 ${activeTab === 'architecture' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          1. System Architecture
        </button>
        <button
          onClick={() => setActiveTab('erd')}
          className={`py-2 px-4 rounded-lg font-medium text-xs transition-all duration-200 ${activeTab === 'erd' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          2. Database Entity Map (ERD)
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`py-2 px-4 rounded-lg font-medium text-xs transition-all duration-200 ${activeTab === 'api' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          3. GraphQL API Contracts
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-4 rounded-lg font-medium text-xs transition-all duration-200 ${activeTab === 'security' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          4. Security Model
        </button>
        <button
          onClick={() => setActiveTab('tech')}
          className={`py-2 px-4 rounded-lg font-medium text-xs transition-all duration-200 ${activeTab === 'tech' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          5. Core Tech Stack
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`py-2 px-4 rounded-lg font-bold text-xs transition-all duration-200 animate-shimmer ${activeTab === 'sandbox' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-gray-800 text-pink-300 hover:bg-gray-700'}`}
        >
          ⚡ Real-time Enterprise Sandbox Playground
        </button>
      </div>

      {/* Main Container */}
      <div className="transition-all duration-300">
        {activeTab === 'architecture' && <ArchitectureDiagram />}
        {activeTab === 'erd' && <ErdDiagram />}
        {activeTab === 'api' && <ApiContract />}
        {activeTab === 'security' && <SecurityModel />}
        {activeTab === 'tech' && <TechStack />}

        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Controller */}
            <div className="lg:col-span-1 bg-gray-900 rounded-lg p-4 border border-gray-850 h-fit space-y-1">
              <h3 className="text-sm font-bold text-cyan-400 mb-3 px-2">Playground Modules</h3>
              <button
                onClick={() => setSandboxSubTab('mpesa')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between ${sandboxSubTab === 'mpesa' ? 'bg-cyan-950 text-cyan-400 border-l-4 border-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <span>M-PESA Hook Simulator</span>
                <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 rounded">Phase 7</span>
              </button>
              <button
                onClick={() => setSandboxSubTab('leases')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between ${sandboxSubTab === 'leases' ? 'bg-cyan-950 text-cyan-400 border-l-4 border-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <span>Leases Lifecycles</span>
                <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 rounded">Phase 2</span>
              </button>
              <button
                onClick={() => setSandboxSubTab('accounting')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between ${sandboxSubTab === 'accounting' ? 'bg-cyan-950 text-cyan-400 border-l-4 border-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <span>Double-Entry ledger</span>
                <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 rounded">Phase 6</span>
              </button>
              <button
                onClick={() => setSandboxSubTab('ocr')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between ${sandboxSubTab === 'ocr' ? 'bg-cyan-950 text-cyan-400 border-l-4 border-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <span>Document OCR Intel</span>
                <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 rounded">Phase 11</span>
              </button>
              <button
                onClick={() => setSandboxSubTab('inspections')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between ${sandboxSubTab === 'inspections' ? 'bg-cyan-950 text-cyan-400 border-l-4 border-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <span>Digitized Inspections</span>
                <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 rounded">Phase 12</span>
              </button>
              <button
                onClick={() => setSandboxSubTab('audit')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between ${sandboxSubTab === 'audit' ? 'bg-cyan-950 text-cyan-400 border-l-4 border-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}
              >
                <span>Security Audit logs</span>
                <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 rounded">Security</span>
              </button>
            </div>

            {/* Sandbox Module Contents */}
            <div className="lg:col-span-3 bg-gray-900 border border-gray-850 rounded-lg p-6 flex flex-col">
              {/* SUB TAB: MPESA */}
              {sandboxSubTab === 'mpesa' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">M-PESA C2B Automated Hook Simulator</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Simulate incoming real-time payment notifications on client paybills. The server captures notifications, matches them to existing tenant accounts based on the registered mobile, reduces outstanding arrears, balances accounts, and inserts a balanced journal records posting bank cash entries!
                    </p>
                  </div>

                  <form onSubmit={handleSimulateMpesa} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Select Tenant Payer</label>
                      <select
                        value={selectedTenantId}
                        onChange={(e) => setSelectedTenantId(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs focus:ring-1 focus:ring-cyan-500"
                      >
                        {availableTenants.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.name} (KES {t.balance || 0} Arrears)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Simulated Phone</label>
                      <input
                        type="text"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                        placeholder="254712345678"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Simulated Settle Amount (KES)</label>
                      <input
                        type="number"
                        value={mpesaAmount}
                        onChange={(e) => setMpesaAmount(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">M-PESA Receipt Number</label>
                      <input
                        type="text"
                        value={mpesaReceipt}
                        onChange={(e) => setMpesaReceipt(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button type="submit" className="w-full bg-cyan-500 text-gray-950 p-2.5 rounded-lg text-xs font-bold hover:bg-cyan-400 mt-2">
                        Simulate API Webhook Confirmation Event
                      </button>
                    </div>
                  </form>

                  {mpesaMessage && (
                    <div className={`p-3 rounded text-xs leading-relaxed ${mpesaMessage.status === 'success' ? 'bg-green-950/50 text-green-400 border border-green-800/50' : 'bg-red-950/50 text-red-400 border border-red-800/50'}`}>
                      {mpesaMessage.text}
                    </div>
                  )}

                  {/* Transactions Ledger */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Simulated Paybill Log</h4>
                    <div className="overflow-x-auto bg-gray-950 rounded border border-gray-850">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-gray-800 bg-gray-900/50">
                            <th className="p-2.5 font-bold">Transaction ID</th>
                            <th className="p-2.5 font-bold">Payer</th>
                            <th className="p-2.5 font-bold">M-PESA Reference</th>
                            <th className="p-2.5 font-bold">Amount</th>
                            <th className="p-2.5 font-bold">Checked Date</th>
                            <th className="p-2.5 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mpesaTransactions.map(tx => (
                            <tr key={tx.id} className="border-b border-gray-850 hover:bg-gray-900/40">
                              <td className="p-2.5 font-mono text-[11px] text-cyan-400">{tx.id}</td>
                              <td className="p-2.5">{tx.tenantName}</td>
                              <td className="p-2.5 font-mono font-bold text-gray-200">{tx.mpesaReceiptNumber}</td>
                              <td className="p-2.5">KES {tx.amount.toLocaleString()}</td>
                              <td className="p-2.5 text-gray-400">{new Date(tx.timestamp).toLocaleString()}</td>
                              <td className="p-2.5">
                                <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold">Validated & Slipped</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: LEASES */}
              {sandboxSubTab === 'leases' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Interactive Lease Lifecycle Manager</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Draft legal contracts with options for rent escalation increments and deposit liability holds. Publishing a lease automatically moves funds to the double-entry escrow, records details, and maps the tenant's security parameters securely!
                    </p>
                  </div>

                  <form onSubmit={handleCreateLease} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Select Leaseholder</label>
                      <select
                        value={selectedTenantId}
                        onChange={(e) => setSelectedTenantId(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                      >
                        {availableTenants.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Assign Unit</label>
                      <select
                        value={selectedUnitId}
                        onChange={(e) => setSelectedUnitId(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                      >
                        {availableUnits.map((u: any) => (
                          <option key={u.id} value={u.id}>{u.name} - {u.propertyName} (Rent: KES {u.rentAmount})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Lease Start Date</label>
                      <input
                        type="date"
                        value={leaseStart}
                        onChange={(e) => setLeaseStart(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Lease Terminus End Date</label>
                      <input
                        type="date"
                        value={leaseEnd}
                        onChange={(e) => setLeaseEnd(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Annual Rent Escalation (%)</label>
                      <input
                        type="number"
                        value={rentEscalation}
                        onChange={(e) => setRentEscalation(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Security Deposit Held (KES)</label>
                      <input
                        type="number"
                        value={securityDep}
                        onChange={(e) => setSecurityDep(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                        placeholder="25000"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Legal Guarantor Full Name</label>
                      <input
                        type="text"
                        value={guarantor}
                        onChange={(e) => setGuarantor(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs"
                        placeholder="Guarantor Name"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button type="submit" className="w-full bg-cyan-500 text-gray-950 p-2.5 rounded-lg text-xs font-bold hover:bg-cyan-400 mt-2">
                        Issue Formal Active Lease Agreement
                      </button>
                    </div>
                  </form>

                  {leaseMessage && (
                    <div className={`p-3 rounded text-xs leading-relaxed ${leaseMessage.status === 'success' ? 'bg-green-950/50 text-green-400 border border-green-800/50' : 'bg-red-950/50 text-red-400 border border-red-800/50'}`}>
                      {leaseMessage.text}
                    </div>
                  )}

                  {/* Active contracts view */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Registered Lease Agreements Ledger</h4>
                    <div className="overflow-x-auto bg-gray-950 rounded border border-gray-850">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-gray-850 bg-gray-900/50">
                            <th className="p-2.5 font-bold">Lease ID</th>
                            <th className="p-2.5 font-bold">Tenant Name</th>
                            <th className="p-2.5 font-bold">Suite Assigned</th>
                            <th className="p-2.5 font-bold">Start / End Bounds</th>
                            <th className="p-2.5 font-bold">Escalation</th>
                            <th className="p-2.5 font-bold">Escrow Deposit</th>
                            <th className="p-2.5 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leases.map(l => (
                            <tr key={l.id} className="border-b border-gray-850 hover:bg-gray-900/45">
                              <td className="p-2.5 font-mono text-cyan-400">#EA-0{l.id}</td>
                              <td className="p-2.5 font-semibold text-white">{l.tenantName}</td>
                              <td className="p-2.5">{l.unitName}</td>
                              <td className="p-2.5 text-gray-300">{l.startDate} to {l.endDate}</td>
                              <td className="p-2.5 text-red-400 font-bold">{l.rentEscalationPercentage}%</td>
                              <td className="p-2.5 font-mono text-green-300">KES {l.securityDepositAmount.toLocaleString()}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${l.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: GENERAL ACCOUNTING */}
              {sandboxSubTab === 'accounting' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Double-Entry Ledger Account Platform</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Ensures mathematical balance precision for audit verification. Adding a transaction updates asset balances dynamically. Post a manual general ledger journal below, keeping standard debit-credit structures balanced in absolute balance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Accounts view */}
                    <div className="bg-gray-950 rounded-lg p-4 border border-gray-850">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">Balanced Chart of Accounts</h4>
                      <div className="space-y-2">
                        {accounts.map(ac => (
                          <div key={ac.code} className="flex items-center justify-between p-2 rounded bg-gray-900 hover:bg-gray-850 border border-gray-800 transition-colors">
                            <div>
                              <span className="font-mono text-xs text-indigo-300 mr-2">{ac.code}</span>
                              <span className="text-xs font-semibold text-white">{ac.name}</span>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{ac.type}</div>
                            </div>
                            <span className="font-mono text-xs font-bold text-green-400">
                              KES {ac.balance.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Manual Journal Form */}
                    <div className="bg-gray-950 rounded-lg p-4 border border-gray-850 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">Adjust Balancing Journal Accrual</h4>
                      <form onSubmit={handleManualJournalSubmit} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-gray-400">Journal Reference Code</label>
                          <input
                            type="text"
                            value={manualRef}
                            onChange={(e) => setManualRef(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs focus:ring-1 focus:ring-cyan-500 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400">Audit Description</label>
                          <input
                            type="text"
                            value={manualDesc}
                            onChange={(e) => setManualDesc(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <label className="col-span-1 text-[9px] text-gray-400 font-bold uppercase">Account Code</label>
                          <label className="col-span-1 text-[9px] text-gray-400 font-bold uppercase">Debit (DR)</label>
                          <label className="col-span-1 text-[9px] text-gray-400 font-bold uppercase">Credit (CR)</label>

                          <input
                            type="text"
                            value={manualLines[0].accountCode}
                            className="bg-gray-800 border border-gray-705 rounded p-1 text-xs text-white font-mono"
                            disabled
                          />
                          <input
                            type="number"
                            value={manualLines[0].debit}
                            onChange={(e) => {
                              const v = e.target.value;
                              setManualLines(prev => [
                                { ...prev[0], debit: v },
                                { ...prev[1], credit: v }
                              ]);
                            }}
                            className="bg-gray-800 border border-gray-705 rounded p-1 text-xs text-green-400 font-mono"
                          />
                          <input
                            type="text"
                            value="0"
                            className="bg-gray-800 border border-gray-705 rounded p-1 text-xs text-gray-500 font-mono"
                            disabled
                          />

                          <input
                            type="text"
                            value={manualLines[1].accountCode}
                            className="bg-gray-800 border border-gray-710 rounded p-1 text-xs text-white font-mono"
                            disabled
                          />
                          <input
                            type="text"
                            value="0"
                            className="bg-gray-800 border border-gray-710 rounded p-1 text-xs text-gray-500 font-mono"
                            disabled
                          />
                          <input
                            type="number"
                            value={manualLines[1].credit}
                            onChange={(e) => {
                              const v = e.target.value;
                              setManualLines(prev => [
                                { ...prev[0], debit: v },
                                { ...prev[1], credit: v }
                              ]);
                            }}
                            className="bg-gray-800 border border-gray-710 rounded p-1 text-xs text-red-400 font-mono"
                          />
                        </div>

                        <button type="submit" className="w-full bg-cyan-500 text-gray-950 py-2 rounded text-xs font-bold hover:bg-cyan-400 mt-2">
                          Post Balancing Journal Allocation
                        </button>
                      </form>

                      {ledgerMessage && (
                        <div className={`p-2.5 rounded text-[11px] leading-relaxed mt-2 ${ledgerMessage.status === 'success' ? 'bg-green-950/50 text-green-400 border border-green-800/50' : 'bg-red-950/50 text-red-400 border border-red-800/50'}`}>
                          {ledgerMessage.text}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Journal Entries List */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">Double-Entry Historical Ledger Records</h4>
                    <div className="space-y-3">
                      {journals.map(je => (
                        <div key={je.id} className="bg-gray-950 border border-gray-850 rounded-lg p-3.5">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                            <div>
                              <span className="font-mono text-cyan-400 text-xs mr-2">{je.id}</span>
                              <span className="text-xs font-bold text-gray-200">{je.reference}</span>
                              <p className="text-[10px] text-gray-500 font-mono">{je.date} | {je.description}</p>
                            </div>
                            <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">Balanced</span>
                          </div>
                          <div className="space-y-1">
                            {je.lines.map((l, idx) => (
                              <div key={idx} className="grid grid-cols-4 text-[11px] font-mono p-1 rounded bg-gray-900/30">
                                <span className="col-span-1 text-[10px] text-indigo-300">{l.accountCode}</span>
                                <span className="col-span-1 text-gray-400">{l.accountName}</span>
                                <span className="col-span-1 text-green-400 text-right">{l.debit > 0 ? `KES ${l.debit.toLocaleString()}` : '-'}</span>
                                <span className="col-span-1 text-red-400 text-right">{l.credit > 0 ? `KES ${l.credit.toLocaleString()}` : '-'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: OCR DOCUMENT INTELLIGENCE */}
              {sandboxSubTab === 'ocr' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Scanned Lease Intelligence AI Extractor (OCR)</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Enables administrators to parse non-formatted scanned lease documentation into key fields: name, monthly rent amounts, escalation rate, and signatures, immediately linking them back to property accounts!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Raw Input Text Channel</h4>
                      <textarea
                        value={ocrText}
                        onChange={(e) => setOcrText(e.target.value)}
                        className="w-full flex-1 bg-gray-900 border border-gray-800 text-xs p-3 rounded text-white h-48 focus:ring-1 focus:ring-cyan-500 leading-relaxed font-mono"
                      />
                      <button
                        onClick={handleOcrAnalyze}
                        disabled={ocrLoading}
                        className="w-full bg-cyan-500 text-gray-950 p-2.5 rounded text-xs font-bold hover:bg-cyan-400 disabled:opacity-50"
                      >
                        {ocrLoading ? 'Analyzing scanned layout and signatures...' : 'Initiate AI Layout Extractions (OCR)'}
                      </button>
                    </div>

                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Confidence Extraction Metrics</h4>
                      {ocrResult ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <span className="text-xs text-gray-400">Analysis Reference:</span>
                            <span className="text-xs font-mono font-bold text-cyan-400">{ocrResult.id}</span>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-gray-900 rounded">
                            <span className="text-xs text-gray-400">Tenant Detected:</span>
                            <span className="text-xs font-bold text-green-300">{ocrResult.tenantDetected}</span>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-gray-900 rounded">
                            <span className="text-xs text-gray-400">Rent Extract (KES):</span>
                            <span className="text-xs font-mono font-bold text-white">KES {ocrResult.parsedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-gray-900 rounded">
                            <span className="text-xs text-gray-400">Escrow Deposit:</span>
                            <span className="text-xs font-mono font-bold text-white">KES {ocrResult.securityDeposit.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-gray-900 rounded">
                            <span className="text-xs text-gray-400">Escalation Percentage:</span>
                            <span className="text-xs font-bold text-red-400">{ocrResult.escalationPercentage}%</span>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-gray-900 rounded">
                            <span className="text-xs text-gray-400">Confidence Rating:</span>
                            <span className="text-xs font-bold text-cyan-400">{ocrResult.confidence}%</span>
                          </div>
                          <div className="p-2bg-emerald-950/20 text-emerald-400 text-[11px] leading-relaxed rounded border border-emerald-800/30 text-center">
                            ✔ Securely indexed and recorded under {ocrResult.fileName} audit log.
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-xs text-gray-500">Submit a raw legal script to trigger machine-learning parser analysis instantly.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: INSPECTIONS */}
              {sandboxSubTab === 'inspections' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Enterprise Operations & Tenant Move Inspections</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Maintain complete accountability of unit physical traits upon tenant transitions. Perform room inspections, mark deficiencies, and lock checklists before tenant keys returns!
                    </p>
                  </div>

                  <form onSubmit={handleInspectionSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Assign Property</label>
                      <input
                        type="text"
                        value={inspectProperty}
                        onChange={(e) => setInspectProperty(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Unit Area</label>
                      <input
                        type="text"
                        value={inspectUnit}
                        onChange={(e) => setInspectUnit(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Transition Phase</label>
                      <select
                        value={inspectType}
                        onChange={(e) => setInspectType(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-gray-300"
                      >
                        <option value="Move-In">Move-In Verification</option>
                        <option value="Move-Out">Move-Out Audit Check</option>
                        <option value="Routine">Standard Routine Property Audit</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-400 mb-1">Deficiency Notes & Remarks</label>
                      <textarea
                        value={inspectNotes}
                        onChange={(e) => setInspectNotes(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs h-20 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button type="submit" className="w-full bg-cyan-500 text-gray-950 p-2.5 rounded text-xs font-bold hover:bg-cyan-400">
                        Record Digitized Unit Inspection Results
                      </button>
                    </div>
                  </form>

                  {inspectionMessage && (
                    <div className={`p-3 rounded text-xs ${inspectionMessage.status === 'success' ? 'bg-green-950/50 text-green-400 border border-green-800/50' : 'bg-red-950/50 text-red-400 border border-red-800/50'}`}>
                      {inspectionMessage.text}
                    </div>
                  )}

                  {/* Inspections Table */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Previous Physical Inspections</h4>
                    <div className="overflow-x-auto bg-gray-950 rounded border border-gray-850">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-gray-850 bg-gray-900/50">
                            <th className="p-2.5 font-bold">Audit ID</th>
                            <th className="p-2.5 font-bold">Location Suite</th>
                            <th className="p-2.5 font-bold">Audit Type</th>
                            <th className="p-2.5 font-bold">Recorded Date</th>
                            <th className="p-2.5 font-bold">Inspector</th>
                            <th className="p-2.5 font-bold">Deficiencies & Structural State</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inspections.map(ins => (
                            <tr key={ins.id} className="border-b border-gray-850 hover:bg-gray-900/40">
                              <td className="p-2.5 font-mono text-cyan-400">#INS-00{ins.id}</td>
                              <td className="p-2.5 font-semibold text-white">{ins.propertyName} {ins.unitName}</td>
                              <td className="p-2.5">{ins.type}</td>
                              <td className="p-2.5 text-gray-400">{ins.date}</td>
                              <td className="p-2.5">{ins.inspector}</td>
                              <td className="p-2.5 text-gray-300 max-w-xs truncate">{ins.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: SYSTEM SECURITY AUDIT */}
              {sandboxSubTab === 'audit' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Security Accountability Log & Web Triggers</h3>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      Tracks administrator sessions and database transactions dynamically. Complete auditing records are printed instantly below in chronologic hierarchy order.
                    </p>
                  </div>

                  <div className="bg-gray-950 rounded-lg p-3 border border-gray-850 max-h-96 overflow-y-auto space-y-2">
                    {auditLogs.slice().reverse().map(log => (
                      <div key={log.id} className="text-[11px] font-mono hover:bg-gray-900/40 p-2 rounded border-b border-gray-850/50 space-y-1">
                        <div className="flex items-center justify-between text-cyan-400 font-bold">
                          <span>👤 {log.user} — {log.action}</span>
                          <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-gray-300">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundationView;
