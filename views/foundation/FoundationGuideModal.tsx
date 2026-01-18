
import React from 'react';

interface FoundationGuideModalProps {
  onClose: () => void;
}

const FoundationGuideModal: React.FC<FoundationGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xl max-w-2xl w-full relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1a237e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome to the Foundation View</h2>
            <p className="text-gray-500 mt-2">This section provides a technical deep-dive into the RealtyOS platform.</p>
          </div>
          
          <div className="text-left text-gray-600 space-y-4 text-sm leading-relaxed">
            <p>
              Here you can explore the core components that make up the system, from the frontend technology stack to the backend architecture and a security model. This view is designed for developers, architects, and technical stakeholders to understand how the application is built.
            </p>
            <p>
              You'll find diagrams and descriptions covering:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
              <li><span className="font-semibold text-[#1a237e]">Technology Stack:</span> The key frameworks, languages, and libraries used.</li>
              <li><span className="font-semibold text-[#1a237e]">API Contract:</span> Examples of our GraphQL API for data interaction.</li>
              <li><span className="font-semibold text-[#1a237e]">System Architecture:</span> A high-level overview of how services connect.</li>
              <li><span className="font-semibold text-[#1a237e]">ERD:</span> The database schema and entity relationships.</li>
              <li><span className="font-semibold text-[#1a237e]">Security Model:</span> Our approach to securing the platform and user data.</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-[#1a237e] hover:bg-blue-900 text-white font-bold py-2 px-8 rounded shadow-sm text-sm transition-colors"
            >
              Got it, let's explore!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationGuideModal;
