import React, { useState } from 'react';

const mockConversations = [
  { id: 1, contact: 'Maintenance Team', subject: 'Re: Unit 505 Leak Report', preview: 'Hi James, we have a technician scheduled for tomorrow at 2 PM...', timestamp: '2h ago', isRead: false },
  { id: 2, contact: 'Maria Garcia', subject: 'Lease Renewal Question', preview: 'Hi, I was wondering what the process is for renewing my lease...', timestamp: '1d ago', isRead: true },
  { id: 3, contact: 'System Alert', subject: 'Overdue Payment: Alex Johnson', preview: 'Invoice #INV-123 for $2200 is 5 days overdue.', timestamp: '2d ago', isRead: true },
  { id: 4, contact: 'Priya Patel', subject: 'Parking Spot Inquiry', preview: 'Is there an extra parking spot available for rent this month?', timestamp: '3d ago', isRead: true },
];

const CommunicationsView: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);

  return (
    <div className="animate-fadeIn h-[calc(100vh-150px)]">
      <div className="text-left mb-6">
        <h2 className="text-3xl font-extrabold text-white mb-2">Communications</h2>
        <p className="text-gray-400">Central hub for all tenant and team messaging.</p>
      </div>

      <div className="flex bg-gray-800 border border-gray-700 rounded-lg shadow-lg h-full overflow-hidden">
        {/* Conversation List */}
        <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-700/50 overflow-y-auto">
          <div className="p-4 border-b border-gray-700/50">
            <input type="text" placeholder="Search messages..." className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm w-full text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500"/>
          </div>
          <nav>
            {mockConversations.map(conv => (
              <button key={conv.id} onClick={() => setSelectedConversation(conv)} className={`w-full text-left p-4 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-cyan-500/10' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-white text-sm">{conv.contact}</h4>
                  <p className="text-xs text-gray-500">{conv.timestamp}</p>
                </div>
                <p className="font-semibold text-gray-300 text-sm truncate">{conv.subject}</p>
                <p className="text-xs text-gray-400 truncate">{conv.preview}</p>
                {!conv.isRead && selectedConversation?.id !== conv.id && <div className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 bg-cyan-400 rounded-full"></div>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Message View */}
        <main className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <header className="p-4 border-b border-gray-700/50 flex-shrink-0">
                <h3 className="text-lg font-bold text-white">{selectedConversation.subject}</h3>
                <p className="text-sm text-gray-400">From: {selectedConversation.contact}</p>
              </header>
              <div className="flex-1 p-6 overflow-y-auto text-gray-300 leading-relaxed">
                <p>Hi James,</p><br/>
                <p>We have a technician scheduled for tomorrow at 2 PM to address the leak reported in Unit 505. Please ensure someone is available to grant access.</p><br/>
                <p>If this time does not work, please let us know as soon as possible.</p><br/>
                <p>Thank you,</p>
                <p>The Maintenance Team</p>
              </div>
              <footer className="p-4 border-t border-gray-700/50">
                <textarea placeholder={`Reply to ${selectedConversation.contact}...`} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm w-full text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 h-24"></textarea>
                <div className="text-right mt-2">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">Send Reply</button>
                </div>
              </footer>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-center">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p className="mt-2 text-gray-500">Select a message to read</p>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommunicationsView;
