
import React from 'react';
import { render } from '../utils/test-utils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

// Helper to mock successful fetch responses
const mockFetchResponse = (data: any, status = 200) => {
    return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(data),
    });
};

describe('RealtyOS E2E Integration Flows', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        
        // Default Mock: Dashboard Load
        (globalThis.fetch as any).mockImplementation((url: string) => {
            if (url.includes('/api/auth/login')) {
                return mockFetchResponse({ token: 'test-token', user: { id: 1, name: 'Admin', role: 'Admin' } });
            }
            if (url.includes('/dashboard/stats')) {
                return mockFetchResponse({
                    totalArrears: 50000,
                    totalAdvance: 10000,
                    tenantsArrearsCount: 5,
                    tenantsAdvanceCount: 2,
                    occupancyRate: 85,
                    totalUnits: 20,
                    occupiedUnits: 17
                });
            }
            if (url.includes('/billing')) {
                return mockFetchResponse({ sms_balance: 500, subscription_due: 0 });
            }
            if (url.includes('/properties')) {
                // Return empty list initially, or populated list for list view
                return mockFetchResponse([]); 
            }
            if (url.includes('/reports/financials/monthly')) {
                return mockFetchResponse([]);
            }
            // Default fallback for other endpoints to prevent crash
            return mockFetchResponse([]);
        });
    });

    it('Complete Flow: Login -> Dashboard -> Add Property', async () => {
        render(<App />);

        // 1. Verify Login Screen
        expect(screen.getByText(/Sign in to RealtyOS/i)).toBeInTheDocument();

        // 2. Perform Login
        fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'admin@realtyos.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        // 3. Verify Dashboard Loaded
        await waitFor(() => {
            expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
            // Check for stats loaded from mock
            expect(screen.getByText('50,000')).toBeInTheDocument(); // Arrears
            expect(screen.getByText('85%')).toBeInTheDocument(); // Occupancy
        });

        // 4. Navigate to Properties
        const propertiesNav = screen.getByText('Properties'); 
        // Note: Sidebar items might be hidden on mobile or inside collapsible, 
        // assuming desktop view or accessible text for test.
        // We might need to click "Property/Unit" parent first if collapsed in default view, 
        // but our mock DataContext loads everything. 
        // Let's assume the user clicks the "Properties" stat card "View Details" or sidebar.
        // Let's try clicking sidebar. Since text is rendered:
        fireEvent.click(propertiesNav);

        await waitFor(() => {
            expect(screen.getByText(/Property Portfolio/i)).toBeInTheDocument();
        });

        // 5. Click Add Property
        const addButton = screen.getByText(/Add Property/i);
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText(/New Property/i)).toBeInTheDocument();
        });

        // 6. Fill Property Form
        fireEvent.change(screen.getByPlaceholderText(/Property Name/i), { target: { value: 'Test Heights' } });
        fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Nairobi' } });
        
        // Mock the POST request for property creation
        (globalThis.fetch as any).mockImplementationOnce((url: string, options: any) => {
            if (url.includes('/api/properties') && options.method === 'POST') {
                const body = JSON.parse(options.body);
                if (body.name === 'Test Heights') {
                    return mockFetchResponse({ id: 123, ...body }, 201);
                }
            }
            return mockFetchResponse({});
        });

        // 7. Submit
        const submitBtn = screen.getByText(/Add Property/i, { selector: 'button' }); // The button inside form
        fireEvent.click(submitBtn);

        // 8. Verify Success Notification or Redirect
        await waitFor(() => {
            // Should be back to list or showing success message
            // We expect DataContext to trigger a refresh.
            // Check if fetch was called with POST
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/properties'),
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    it('handles file upload in payments', async () => {
        // Bypass login by setting token
        localStorage.setItem('token', 'fake-token');
        
        render(<App />);
        
        // Wait for data load
        await waitFor(() => expect(screen.getByText(/Dashboard/i)).toBeInTheDocument());

        // Navigate to Payments
        // Using a direct way to set view if possible, or clicking nav.
        // Let's assume we click "Financials" then "Payments"
        // For simplicity in this integration test, we can use the "More Actions" on dashboard
        const uploadBtn = screen.getByText(/Upload Bank Statement/i);
        fireEvent.click(uploadBtn);

        await waitFor(() => {
            expect(screen.getByText(/Upload Bank Statement/i)).toBeInTheDocument();
        });

        // Simulate File Drop/Selection
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(['dummy content'], 'statement.csv', { type: 'text/csv' });
        
        // Mock upload endpoint
        (globalThis.fetch as any).mockImplementation((url: string) => {
            if(url.includes('/files/upload')) {
                return mockFetchResponse({ success: true, url: '/uploads/statement.csv' });
            }
            return mockFetchResponse([]);
        });

        fireEvent.change(fileInput, { target: { files: [file] } });
        
        const uploadActionBtn = screen.getByText('Upload Statement');
        fireEvent.click(uploadActionBtn);

        await waitFor(() => {
            expect(screen.getByText(/File uploaded successfully/i)).toBeInTheDocument();
        });
    });
});
