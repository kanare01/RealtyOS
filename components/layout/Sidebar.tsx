
import React, { useState, useMemo } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface NavItemConfig {
  view: View;
  label: string;
  icon: React.ReactElement;
  children?: Omit<NavItemConfig, 'children' | 'icon'>[];
}

const baseNavConfig: NavItemConfig[] = [
  { view: 'Dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 11a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  {
    view: 'Financials', label: 'Financials', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.196.552-.257.206-.061.417-.091.633-.091s.427.03.633.091c.206.061.394.154.552.257.158.103.304.226.438.368.133.142.24.304.32.482.08.178.12.37.12.568s-.04.39-.12.568c-.08.178-.187.34-.32.482c-.134.142-.28.265-.438.368c-.158.103-.346.196-.552-.257c-.206.061-.417.091-.633-.091s-.427-.03-.633-.091c-.206-.061-.394-.154-.552-.257c-.158-.103-.304-.226-.438-.368c-.133-.142-.24-.304-.32-.482c-.08-.178-.12-.37-.12-.568s.04-.39.12-.568c.08.178.187.34.32.482c.134.142.28-.265.438-.368zM10 3a1 1 0 011 1v1h1a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V6a1 1 0 011-1h1V4a1 1 0 011-1z" /></svg>,
    children: [
      { view: 'Invoices', label: 'Invoices' },
      { view: 'Payments', label: 'Payments' },
      { view: 'Expenses', label: 'Expenses' },
    ]
  },
  { view: 'Tenants', label: 'Tenants', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.558 5.422a.5.5 0 00-.558.447 5.003 5.003 0 006.232 0 .5.5 0 00-.558-.447 3.001 3.001 0 00-5.116 0zM16 8a3 3 0 11-6 0 3 3 0 016 0zm1.558 3.422a.5.5 0 01.558.447 5.003 5.003 0 01-6.232 0 .5.5 0 01.558-.447 3.001 3.001 0 015.116 0z" /></svg> },
  {
    view: 'Property/Unit', label: 'Property/Unit', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
    children: [
      { view: 'Properties', label: 'Properties' },
      { view: 'Units', label: 'Units' },
      { view: 'Utilities', label: 'Utilities' },
      { view: 'Maintenance', label: 'Maintenance' },
      { view: 'Property Grouping', label: 'Property Grouping' },
    ]
  },
  {
    view: 'Reports', label: 'Reports', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15 15V5a2 2 0 00-2-2H7a2 2 0 00-2 2v10l-2 2v1h14v-1l-2-2zM8 5h4v1H8V5zm0 2h4v1H8V7zm0 2h4v1H8V9zm-3 5a1 1 0 011-1h8a1 1 0 011 1v1H5v-1z" clipRule="evenodd" /></svg>,
    children: [
      { view: 'Statements', label: 'Statements' },
      { view: 'Insights (beta)', label: 'Insights (beta)' },
    ]
  },
  { view: 'Communication', label: 'Communication', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg> },
  {
    view: 'Settings', label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>,
    children: [
        { view: 'General', label: 'General' },
        { view: 'Backup', label: 'Backup' },
        { view: 'Alerts', label: 'Alerts' },
        { view: 'Account Info', label: 'Account Info' },
        { view: 'Documents (beta)', label: 'Documents (beta)' },
        { view: 'Custom Message Template', label: 'Custom Message Template' },
        { view: 'Team', label: 'Team' },
        { view: 'Billing', label: 'Billing' },
        { view: 'MPESA Transactions', label: 'MPESA Transactions' },
        { view: 'Audit Trail', label: 'Audit Trail' },
        { view: 'User Feedback', label: 'User Feedback' },
    ]
  },
  { view: 'Foundation', label: 'Foundation', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg> },
];

const Sidebar: React.FC<{
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}> = ({ currentView, setCurrentView, isCollapsed = false, toggleCollapse }) => {
  const { currentUser } = useData();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    if (isCollapsed && toggleCollapse) {
        toggleCollapse();
        setTimeout(() => setOpenMenus(prev => ({ ...prev, [label]: true })), 50);
        return;
    }
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isChildActive = (item: NavItemConfig) => {
    return item.children?.some(child => child.view === currentView) ?? false;
  };

  const filteredNavConfig = useMemo(() => {
    return baseNavConfig.map(item => {
        // Filter sub-items if present
        if (item.children) {
            let allowedChildren = item.children;
            
            // Only Admins see Audit Trail, Backup, Team
            if (currentUser?.role !== 'Admin') {
                allowedChildren = allowedChildren.filter(child => 
                    !['Audit Trail', 'Backup', 'Team', 'System Status'].includes(child.label)
                );
            }
            
            // Hide Technical Foundation from Agents
            if (currentUser?.role === 'Agent') {
                 if (item.view === 'Foundation') return null;
            }

            return { ...item, children: allowedChildren };
        }
        
        // Hide Foundation entirely for agents if it's a top level item (redundant check if nested, but safe)
        if (currentUser?.role === 'Agent' && item.view === 'Foundation') return null;

        return item;
    }).filter(Boolean) as NavItemConfig[];
  }, [currentUser]);
  
  const NavButton: React.FC<{item: NavItemConfig}> = ({ item }) => {
    const isActive = currentView === item.view;
    return (
        <button 
            onClick={() => setCurrentView(item.view)} 
            className={`relative flex items-center w-full text-left p-2.5 my-1 rounded-lg transition-all duration-200 group ${ isActive ? 'bg-white/10 text-white' : 'text-blue-100 hover:bg-white/5'}`}
            title={isCollapsed ? item.label : ''}
        >
            {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 rounded-r-full"></span>}
            <span className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>
            {!isCollapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
        </button>
    );
  };
  
  const ChildNavButton: React.FC<{item: Omit<NavItemConfig, 'children' | 'icon'>}> = ({ item }) => {
    const isActive = currentView === item.view;
    return (
        <button onClick={() => setCurrentView(item.view)} className={`relative flex items-center w-full text-left p-2 rounded-md transition-colors duration-200 text-sm ${ isActive ? 'text-white font-semibold' : 'text-blue-200 hover:text-white'}`}>
             {item.label}
        </button>
    );
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#1a237e] flex flex-col p-3 text-white transition-all duration-300 h-full border-r border-[#1a237e]`}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'} mb-6 pt-3`}>
        {!isCollapsed && <h2 className="text-2xl font-bold truncate">RealtyOS</h2>}
        {toggleCollapse && (
            <button onClick={toggleCollapse} className="text-blue-200 hover:text-white p-1 rounded-md hover:bg-white/10">
                {isCollapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                )}
            </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
        <ul className="space-y-1">
          {filteredNavConfig.map(item => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button 
                    onClick={() => toggleMenu(item.label)} 
                    className={`flex items-center w-full text-left p-2.5 rounded-lg transition-colors duration-200 ${ isChildActive(item) ? 'text-white' : 'text-blue-100 hover:bg-white/5'} ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center">
                      <span className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}>{item.icon}</span>
                      {!isCollapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${openMenus[item.label] ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isCollapsed && openMenus[item.label] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className="pt-1 pb-2 pl-10 space-y-1">
                      {item.children.map(child => (
                        <li key={child.label}>
                           <ChildNavButton item={child} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <NavButton item={item} />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
