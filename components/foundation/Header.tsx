import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const getIconForView = (view: View) => {
    // A simple mapping to get an icon for the view title. Could be expanded.
    switch (view) {
      case 'Invoices':
      case 'Financials':
        return '$';
      default:
        return null;
    }
  };

  const icon = getIconForView(currentView);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-3 z-10 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center">
        <button className="md:hidden mr-3 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center">
          {icon && <span className="text-lg font-bold text-gray-600 mr-2">{icon}</span>}
          <h1 className="text-xl font-semibold text-gray-800">{currentView}</h1>
        </div>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-lg">
          <input
            type="search"
            placeholder="Search... Pages, Actions, Tutorials"
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;