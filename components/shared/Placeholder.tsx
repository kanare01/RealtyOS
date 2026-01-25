import React from 'react';

const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 shadow-2xl max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-cyan-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <h2 className="text-3xl font-extrabold text-white mb-2">{title}</h2>
        <p className="text-gray-400">This module is under construction. Check back soon for updates!</p>
      </div>
    </div>
  );
};

export default Placeholder;