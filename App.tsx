import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { View } from './types';
import { DataProvider } from './contexts/DataContext';
import LandingPageView from './views/dashboard/LandingPageView';

// Main view components
import DashboardView from './views/dashboard/DashboardView';
import InvoicingView from './views/invoicing/InvoicingView';
import TenantsView from './views/tenants/TenantsView';
import PropertiesView from './views/properties/PropertiesView';
import ReportsView from './views/reports/ReportsView';
import CommunicationsView from './views/communications/CommunicationsView';
import SettingsView from './views/settings/SettingsView';
import Placeholder from './components/shared/Placeholder';
import PaymentsView from './views/payments/PaymentsView';
import PaymentFormView from './views/payments/PaymentFormView';
import ExpensesView from './views/expenses/ExpensesView';
import ExpenseFormView from './views/expenses/ExpenseFormView';
import RecurringExpenseFormView from './views/expenses/RecurringExpenseFormView';
import UnitsView from './views/units/UnitsView';
import UtilitiesView from './views/utilities/UtilitiesView';
import MaintenanceView from './views/maintenance/MaintenanceView';
import MaintenanceFormView from './views/maintenance/MaintenanceFormView';
import PropertyGroupingView from './views/propertyGrouping/PropertyGroupingView';
import StatementsView from './views/reports/StatementsView';
import InsightsView from './views/insights/InsightsView';
import GettingStartedView from './views/dashboard/GettingStartedView';
import PropertyFormView from './views/properties/PropertyFormView';
import UnitFormView from './views/units/UnitFormView';
import TenantFormView from './views/tenants/TenantFormView';
import BulkTenantFormView from './views/tenants/BulkTenantFormView';
import InvoiceFormView from './views/invoicing/InvoiceFormView';
import GeneralSettingsView from './views/settings/GeneralSettingsView';
import BackupSettingsView from './views/settings/BackupSettingsView';
import AlertsSettingsView from './views/settings/AlertsSettingsView';
import AccountInfoSettingsView from './views/settings/AccountInfoSettingsView';
import DocumentsSettingsView from './views/settings/DocumentsSettingsView';
import CustomMessageTemplateSettingsView from './views/settings/CustomMessageTemplateSettingsView';
import TeamSettingsView from './views/settings/TeamSettingsView';
import BillingSettingsView from './views/settings/BillingSettingsView';
import MpesaTransactionsSettingsView from './views/settings/MpesaTransactionsSettingsView';
import AuditTrailSettingsView from './views/settings/AuditTrailSettingsView';
import FoundationView from './views/foundation/FoundationView';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const toggleDesktopSidebar = () => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);

  // Helper to close sidebar on navigation on mobile
  const handleSetCurrentView = (view: View) => {
    setCurrentView(view);
    closeMobileSidebar();
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardView setCurrentView={handleSetCurrentView} />;
      case 'Getting Started':
        return <GettingStartedView setCurrentView={handleSetCurrentView} />;
      case 'PropertyForm':
        return <PropertyFormView setCurrentView={handleSetCurrentView} />;
      case 'UnitForm':
        return <UnitFormView setCurrentView={handleSetCurrentView} />;
      case 'TenantForm':
        return <TenantFormView setCurrentView={handleSetCurrentView} />;
      case 'BulkTenantForm':
        return <BulkTenantFormView setCurrentView={handleSetCurrentView} />;
      case 'Invoices':
        return <InvoicingView setCurrentView={handleSetCurrentView} />;
      case 'InvoiceForm':
        return <InvoiceFormView setCurrentView={handleSetCurrentView} />;
      case 'Payments':
        return <PaymentsView setCurrentView={handleSetCurrentView} />;
      case 'PaymentForm':
        return <PaymentFormView setCurrentView={handleSetCurrentView} />;
      case 'Expenses':
        return <ExpensesView setCurrentView={handleSetCurrentView} />;
      case 'ExpenseForm':
        return <ExpenseFormView setCurrentView={handleSetCurrentView} />;
      case 'RecurringExpenseForm':
        return <RecurringExpenseFormView setCurrentView={handleSetCurrentView} />;
      case 'Tenants':
        return <TenantsView setCurrentView={handleSetCurrentView} />;
      case 'Properties':
        return <PropertiesView setCurrentView={handleSetCurrentView} />;
      case 'Units':
        return <UnitsView setCurrentView={handleSetCurrentView} />;
      case 'Utilities':
        return <UtilitiesView setCurrentView={handleSetCurrentView} />;
      case 'Maintenance':
        return <MaintenanceView setCurrentView={handleSetCurrentView} />;
      case 'MaintenanceForm':
        return <MaintenanceFormView setCurrentView={handleSetCurrentView} />;
      case 'Property Grouping':
        return <PropertyGroupingView setCurrentView={handleSetCurrentView} />;
      case 'Reports':
        return <ReportsView />;
      case 'Statements':
        return <StatementsView />;
      case 'Insights (beta)':
        return <InsightsView />;
      case 'Communication':
        return <CommunicationsView />;
      case 'Settings':
        return <SettingsView />;
      case 'General':
        return <GeneralSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Backup':
        return <BackupSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Alerts':
        return <AlertsSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Account Info':
        return <AccountInfoSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Documents (beta)':
        return <DocumentsSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Custom Message Template':
        return <CustomMessageTemplateSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Team':
        return <TeamSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Billing':
        return <BillingSettingsView setCurrentView={handleSetCurrentView} />;
      case 'MPESA Transactions':
        return <MpesaTransactionsSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Audit Trail':
        return <AuditTrailSettingsView setCurrentView={handleSetCurrentView} />;
      case 'Financials':
      case 'Property/Unit':
        return <Placeholder title={currentView} />;
      case 'Foundation':
        return <FoundationView />;
      default:
        return <Placeholder title="Unknown View" />;
    }
  };

  if (showLanding) {
    return <LandingPageView onStartTrial={() => setShowLanding(false)} />;
  }

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300"
            onClick={closeMobileSidebar}
          ></div>
        )}

        {/* Sidebar Wrapper */}
        <div className={`
            fixed inset-y-0 left-0 z-30 transition-all duration-300 transform 
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:relative md:translate-x-0 
            ${isDesktopSidebarCollapsed ? 'w-20' : 'w-64'}
            flex-shrink-0
        `}>
           <Sidebar 
                currentView={currentView} 
                setCurrentView={handleSetCurrentView} 
                isCollapsed={isDesktopSidebarCollapsed}
                toggleCollapse={toggleDesktopSidebar}
            />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300">
          <Header 
            currentView={currentView} 
            onMenuClick={toggleMobileSidebar} 
            onLogout={() => setShowLanding(true)}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 relative scroll-smooth">
            {renderView()}
          </main>
        </div>
      </div>
    </DataProvider>
  );
};

export default App;