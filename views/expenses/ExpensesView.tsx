
import React, { useState, useMemo } from 'react';
import ExpensesFiltersPanel from './ExpensesFiltersPanel';
import ExpensesSummaryCard from './ExpensesSummaryCard';
import ExpensesTable from './ExpensesTable';
import RecurringExpensesFiltersPanel from './RecurringExpensesFiltersPanel';
import RecurringExpensesSummaryCard from './RecurringExpensesSummaryCard';
import RecurringExpensesTable from './RecurringExpensesTable';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface ExpensesViewProps {
    setCurrentView: (view: View) => void;
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ setCurrentView }) => {
    const { expenses, recurringExpenses, properties } = useData();
    const [activeTab, setActiveTab] = useState<'Expenses' | 'Recurring'>('Expenses');

    // -- Regular Expenses State --
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [amountRange, setAmountRange] = useState({ min: '', max: '' });
    const [statusFilter, setStatusFilter] = useState<string[]>(['confirmed']);

    // -- Recurring Expenses State --
    const [recSearchTerm, setRecSearchTerm] = useState('');
    const [recPropertyFilter, setRecPropertyFilter] = useState('');
    const [recFrequencyFilter, setRecFrequencyFilter] = useState<string[]>(['Monthly']);
    const [recStatusFilter, setRecStatusFilter] = useState<string[]>(['Active']);

    // -- Filter Logic: Regular Expenses --
    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                (e.description && e.description.toLowerCase().includes(searchLower)) ||
                (e.category && e.category.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;

            if (propertyFilter && propertyFilter !== 'All Properties' && e.property !== propertyFilter) return false;
            
            if (dateRange.start && new Date(e.date) < new Date(dateRange.start)) return false;
            if (dateRange.end && new Date(e.date) > new Date(dateRange.end)) return false;

            if (amountRange.min && e.amount < parseFloat(amountRange.min)) return false;
            if (amountRange.max && e.amount > parseFloat(amountRange.max)) return false;

            if (statusFilter.length > 0 && !statusFilter.includes(e.status)) return false;

            return true;
        });
    }, [expenses, searchTerm, propertyFilter, dateRange, amountRange, statusFilter]);

    // -- Filter Logic: Recurring Expenses --
    const filteredRecurringExpenses = useMemo(() => {
        return recurringExpenses.filter(e => {
            const searchLower = recSearchTerm.toLowerCase();
            const matchesSearch = 
                (e.description && e.description.toLowerCase().includes(searchLower)) ||
                (e.category && e.category.toLowerCase().includes(searchLower));
            if (!matchesSearch) return false;

            if (recPropertyFilter && recPropertyFilter !== 'All Properties' && e.property !== recPropertyFilter) return false;

            if (recFrequencyFilter.length > 0 && !recFrequencyFilter.includes(e.frequency)) return false;
            if (recStatusFilter.length > 0 && !recStatusFilter.includes(e.status)) return false;

            return true;
        });
    }, [recurringExpenses, recSearchTerm, recPropertyFilter, recFrequencyFilter, recStatusFilter]);


    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg self-start">
                    <button
                        onClick={() => setActiveTab('Expenses')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            activeTab === 'Expenses' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                    >
                        Expenses
                    </button>
                    <button
                        onClick={() => setActiveTab('Recurring')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            activeTab === 'Recurring' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                    >
                        Recurring Expenses <span className="text-xs ml-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">Beta</span>
                    </button>
                </div>
                
                <div className="flex items-center space-x-2">
                    {activeTab === 'Expenses' ? (
                        <button 
                            onClick={() => setCurrentView('ExpenseForm')}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Record Expense
                        </button>
                    ) : (
                         <button 
                            onClick={() => setCurrentView('RecurringExpenseForm')}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Recurring Expense
                        </button>
                    )}
                     <div className="relative">
                        <button className="px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'Expenses' && (
                <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
                    <div className="lg:w-1/4">
                        <ExpensesFiltersPanel 
                            properties={properties}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            propertyFilter={propertyFilter}
                            onPropertyChange={setPropertyFilter}
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                            amountRange={amountRange}
                            onAmountRangeChange={setAmountRange}
                            statusFilter={statusFilter}
                            onStatusChange={setStatusFilter}
                        />
                    </div>
                    <div className="lg:w-3/4 flex flex-col gap-6">
                        <ExpensesSummaryCard expenses={filteredExpenses} />
                        <ExpensesTable expenses={filteredExpenses} />
                    </div>
                </div>
            )}
            
            {activeTab === 'Recurring' && (
                <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
                    <div className="lg:w-1/4">
                        <RecurringExpensesFiltersPanel 
                            properties={properties}
                            searchTerm={recSearchTerm}
                            onSearchChange={setRecSearchTerm}
                            propertyFilter={recPropertyFilter}
                            onPropertyChange={setRecPropertyFilter}
                            frequencyFilter={recFrequencyFilter}
                            onFrequencyChange={setRecFrequencyFilter}
                            statusFilter={recStatusFilter}
                            onStatusChange={setRecStatusFilter}
                        />
                    </div>
                    <div className="lg:w-3/4 flex flex-col gap-6">
                        <RecurringExpensesSummaryCard expenses={filteredRecurringExpenses} />
                        <RecurringExpensesTable expenses={filteredRecurringExpenses} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesView;
