
import React, { useState, useRef } from 'react';
import { View, Tenant } from '../../types';
import { useData } from '../../contexts/DataContext';

interface BulkTenantFormViewProps {
    setCurrentView: (view: View) => void;
}

const BulkTenantFormView: React.FC<BulkTenantFormViewProps> = ({ setCurrentView }) => {
    const { lastCreatedUnits, addTenants, properties, units } = useData();
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<Partial<Tenant>[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 1: Generate CSV Template
    const handleDownloadTemplate = () => {
        // Removed Property Name from header, made Email explicitly optional in header text
        let csvContent = "Unit ID,Rent Amount,First Name,Last Name,Phone Number,Email (Optional)\n";
        
        if (lastCreatedUnits.length > 0) {
            lastCreatedUnits.forEach(unit => {
                // Removed unit.propertyName from the row data
                csvContent += `${unit.name},${unit.rentAmount},,,,\n`;
            });
        } else {
            // Fallback
            csvContent += `A101,15000,,,,\n`;
            csvContent += `A102,15000,,,,\n`;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "bulk_tenant_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Step 2: Handle File Selection & Parsing
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            parseCSV(e.target.files[0]);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const parsedData: Partial<Tenant>[] = [];

            // Skip header (i=1)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const cols = line.split(',');
                    if (cols.length >= 1) { 
                        const unitName = cols[0]?.trim();
                        
                        // Attempt to find the property based on the Unit Name from existing system data
                        // Prioritize checking lastCreatedUnits first, then all units
                        const matchedUnit = lastCreatedUnits.find(u => u.name === unitName) || units.find(u => u.name === unitName);
                        const resolvedProperty = matchedUnit ? matchedUnit.propertyName : (properties.length > 0 ? properties[0].name : 'Unknown Property');

                        // Adjusted indices since Property Name (col 0) was removed
                        parsedData.push({
                            property: resolvedProperty,
                            unit: unitName,
                            // cols[1] is Rent Amount (ignored for tenant object usually)
                            firstName: cols[2]?.trim(),
                            lastName: cols[3]?.trim(),
                            phone: cols[4]?.trim(),
                            email: cols[5]?.trim() || 'N/A'
                        });
                    }
                }
            }
            setPreviewData(parsedData);
        };
        reader.readAsText(file);
    };

    // Step 3: Submit Data
    const handleImport = () => {
        setIsProcessing(true);
        
        // Simulate processing delay
        setTimeout(() => {
            const tenantsToAdd: Tenant[] = [];

            previewData.forEach((data, index) => {
                // Find property ID if possible
                const prop = properties.find(p => p.name === data.property);
                
                if (data.unit && data.firstName && data.lastName && data.phone) {
                    tenantsToAdd.push({
                        id: Date.now() + index,
                        name: `${data.firstName} ${data.lastName}`,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email || 'N/A',
                        phone: data.phone,
                        property: data.property || prop?.name || 'Unknown',
                        propertyId: prop?.id || 0,
                        unit: data.unit,
                        unitId: 0, // In a real app we'd lookup unit ID
                        status: 'Active',
                        leaseEndDate: 'N/A',
                        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                        balance: 0
                    });
                }
            });

            if (tenantsToAdd.length > 0) {
                addTenants(tenantsToAdd);
            }
            
            setIsProcessing(false);
            setUploadSuccess(true);
            setTimeout(() => {
                setCurrentView('Tenants');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="animate-fadeIn w-full max-w-5xl mx-auto pb-20 relative px-4 md:px-0">
            {/* Header */}
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('UnitForm')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Unit Form
                </button>
                <h2 className="text-2xl font-normal text-gray-700">Bulk Add Tenants</h2>
                <p className="text-gray-500 text-sm mt-1">Upload tenant details for the units you just created.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Instructions & Template */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-[#1a237e] font-bold mb-4">1</div>
                        <h3 className="font-medium text-gray-800 mb-2">Download Template</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            We've prepared a CSV file with your newly created units ({lastCreatedUnits.length} units). 
                            Download it and fill in the tenant details.
                        </p>
                        <button 
                            onClick={handleDownloadTemplate}
                            className="w-full flex items-center justify-center space-x-2 border border-[#1a237e] text-[#1a237e] py-2 rounded hover:bg-blue-50 transition-colors font-medium text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download Template</span>
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-[#1a237e] font-bold mb-4">2</div>
                        <h3 className="font-medium text-gray-800 mb-2">Upload Completed CSV</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Once you've filled in the details (First Name, Last Name, Phone Number are required), upload the file here.
                        </p>
                        
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                accept=".csv" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm text-[#1a237e] font-medium">Click to upload CSV</span>
                            {file && <p className="text-xs text-green-600 mt-2 font-medium">{file.name}</p>}
                        </div>
                    </div>
                </div>

                {/* Right Side: Preview & Action */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-[#1a237e] font-bold">3</div>
                                <h3 className="font-medium text-gray-800">Preview & Import</h3>
                            </div>
                            {previewData.length > 0 && (
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{previewData.length} Tenants found</span>
                            )}
                        </div>

                        <div className="flex-1 border border-gray-200 rounded bg-gray-50 overflow-auto max-h-[500px] mb-4">
                            {previewData.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-sm">No data to preview yet.</p>
                                </div>
                            ) : (
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600 font-medium sticky top-0">
                                        <tr>
                                            <th className="p-3 border-b">Unit</th>
                                            <th className="p-3 border-b">Category</th>
                                            <th className="p-3 border-b">First Name</th>
                                            <th className="p-3 border-b">Last Name</th>
                                            <th className="p-3 border-b">Phone</th>
                                            <th className="p-3 border-b">Email</th>
                                            <th className="p-3 border-b">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, idx) => (
                                            <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium text-[#1a237e]">{row.unit}</td>
                                                <td className="p-3 text-sm text-gray-500">
                                                    {/* Lookup category from units */}
                                                    {units.find(u => u.name === row.unit)?.category || '-'}
                                                </td>
                                                <td className="p-3">{row.firstName || <span className="text-red-400 italic">Missing</span>}</td>
                                                <td className="p-3">{row.lastName || <span className="text-red-400 italic">Missing</span>}</td>
                                                <td className="p-3">{row.phone || <span className="text-red-400 italic">Missing</span>}</td>
                                                <td className="p-3 text-gray-500">{row.email || 'N/A'}</td>
                                                <td className="p-3">
                                                    {row.firstName && row.lastName && row.phone ? (
                                                        <span className="text-green-600 text-xs font-bold">Ready</span>
                                                    ) : (
                                                        <span className="text-red-500 text-xs font-bold">Incomplete</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {uploadSuccess ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded text-center">
                                <p className="font-bold">Success!</p>
                                <p className="text-sm">Tenants imported successfully. Redirecting...</p>
                            </div>
                        ) : (
                            <button 
                                onClick={handleImport}
                                disabled={previewData.length === 0 || isProcessing}
                                className={`w-full py-3 rounded font-medium text-white transition-colors ${
                                    previewData.length === 0 || isProcessing 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-[#000080] hover:bg-blue-900 shadow-md'
                                }`}
                            >
                                {isProcessing ? 'Importing...' : 'Import Tenants'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkTenantFormView;
