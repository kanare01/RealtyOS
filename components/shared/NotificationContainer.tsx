
import React from 'react';
import { useData } from '../../contexts/DataContext';

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useData();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 sm:top-24 sm:right-4 sm:left-auto sm:max-w-sm z-[100] flex flex-col space-y-2 pointer-events-none p-2 sm:p-0">
            {notifications.map((note) => (
                <div 
                    key={note.id}
                    className={`
                        pointer-events-auto transform transition-all duration-300 ease-in-out
                        w-full bg-white/95 backdrop-blur-sm border-l-4 rounded shadow-xl p-4 flex items-start justify-between
                        ${note.type === 'success' ? 'border-green-500' : ''}
                        ${note.type === 'error' ? 'border-red-500' : ''}
                        ${note.type === 'info' ? 'border-blue-500' : ''}
                        ${note.type === 'warning' ? 'border-yellow-500' : ''}
                        animate-fadeIn hover:scale-[1.02] cursor-pointer
                    `}
                    onClick={() => removeNotification(note.id)}
                >
                    <div className="flex-1 mr-2">
                        <div className="flex items-center mb-1">
                            {note.type === 'success' && <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>}
                            {note.type === 'error' && <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>}
                            {note.type === 'info' && <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                            
                            <h4 className={`text-sm font-bold capitalize ${
                                note.type === 'success' ? 'text-green-800' :
                                note.type === 'error' ? 'text-red-800' :
                                note.type === 'info' ? 'text-blue-800' : 'text-gray-800'
                            }`}>
                                {note.type}
                            </h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-snug">{note.message}</p>
                    </div>
                    <button 
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        aria-label="Close notification"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
