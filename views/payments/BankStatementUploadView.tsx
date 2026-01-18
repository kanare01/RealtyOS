
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface BankStatementUploadViewProps {
    setCurrentView: (view: View) => void;
}

const BankStatementUploadView: React.FC<BankStatementUploadViewProps> = ({ setCurrentView }) => {
    const { uploadFile } = useData();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setMessage('');

        const result = await uploadFile(file, 'bank_statements');
        
        setIsUploading(false);
        if (result.success) {
            setMessage('File uploaded successfully! Processing started.');
            setTimeout(() => setCurrentView('Payments'), 2000);
        } else {
            setMessage(`Upload failed: ${result.message}`);
        }
    };

    return (
        <div className="animate-fadeIn w-full max-w-3xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Payments')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Payments
                </button>
                <h2 className="text-2xl font-normal text-gray-700">Upload Bank Statement</h2>
                <p className="text-gray-500 text-sm mt-1">Upload CSV or PDF statement to auto-reconcile payments.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors relative">
                    <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept=".csv,.pdf,.xls,.xlsx"
                    />
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-700 font-medium mb-1">
                            {file ? file.name : "Drag and drop or click to select"}
                        </p>
                        <p className="text-xs text-gray-500">Supported formats: CSV, PDF, XLS</p>
                    </div>
                </div>

                {message && (
                    <div className={`mt-4 p-3 text-sm rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${!file || isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1a237e] hover:bg-blue-900'}`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Statement'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankStatementUploadView;
