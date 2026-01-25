
import React from 'react';
import { Message } from '../../types';
import { useData } from '../../contexts/DataContext';

interface CommunicationsTableProps {
    messages: Message[];
}

const CommunicationsTable: React.FC<CommunicationsTableProps> = ({ messages }) => {
    const { addMessage } = useData();

    const handleResend = (msg: Message) => {
        if (confirm("Resend this message?")) {
            // Mock resend by adding a new log
            addMessage({
                ...msg,
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                status: 'Pending'
            });
            alert("Message queued for resending.");
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Messages</h3>
                 <span className="text-sm text-gray-500">{messages.length} Records</span>
            </div>
            <div className="p-4">
                <div className="mb-4 flex space-x-2">
                    <button 
                        onClick={() => alert("Bulk resend not implemented yet.")}
                        className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Resend Selected
                    </button>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-normal border-b border-gray-100">
                            <tr>
                                <th className="p-3 w-8"><input type="checkbox" className="rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" /></th>
                                <th className="p-3 font-normal">Type</th>
                                <th className="p-3 font-normal">Date</th>
                                <th className="p-3 font-normal">Tenant/Team</th>
                                <th className="p-3 font-normal">Property<br/><span className="text-xs">(Unit)</span></th>
                                <th className="p-3 font-normal">Message</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {messages.map(msg => (
                                <tr key={msg.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                    <td className="p-3"><input type="checkbox" className="rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" /></td>
                                    <td className="p-3">
                                        {msg.type === 'SMS' ? (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">SMS</span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Email</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-xs whitespace-nowrap">{msg.date}</td>
                                    <td className="p-3 font-medium text-[#1a237e]">{msg.recipient}</td>
                                    <td className="p-3">
                                        <div className="text-xs text-gray-700">{msg.property || '-'}</div>
                                        <div className="text-xs text-gray-400">{msg.unit ? `(${msg.unit})` : ''}</div>
                                    </td>
                                    <td className="p-3 text-xs max-w-xs truncate" title={msg.content}>{msg.content}</td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            msg.status === 'Delivered' ? 'text-green-600 bg-green-50' : 
                                            msg.status === 'Failed' ? 'text-red-600 bg-red-50' : 
                                            'text-gray-600 bg-gray-100'
                                        }`}>
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button 
                                            onClick={() => handleResend(msg)}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Resend
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">
                                        No messages found. Click "New Message" to send one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center justify-between pt-4 text-xs text-gray-500 border-t border-gray-100 mt-4">
                    <div className="flex items-center">
                        <select className="border-gray-300 rounded text-xs py-1 pl-2 pr-6 bg-white mr-3 focus:ring-[#1a237e] focus:border-[#1a237e]">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <p>Showing {messages.length > 0 ? 1 : 0} to {messages.length} of {messages.length} Results</p>
                    </div>
                    <div className="flex space-x-1">
                        <button className="px-2 py-1 border rounded disabled:opacity-50" disabled>&lt;</button>
                        <button className="px-2 py-1 border rounded disabled:opacity-50" disabled>&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationsTable;
