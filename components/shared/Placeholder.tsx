
import React from 'react';

const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 animate-fadeIn min-h-[400px]">
      <div className="bg-white border border-gray-200 rounded-lg p-10 shadow-sm max-w-md">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">
            This module is currently under active development. 
            <br />
            Please use the navigation menu to access available features.
        </p>
        <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-sm transition-colors"
        >
            Reload Application
        </button>
      </div>
    </div>
  );
};

export default Placeholder;
