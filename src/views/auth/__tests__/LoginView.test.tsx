
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import LoginView from '../LoginView';

describe('LoginView', () => {
    it('renders login form correctly', () => {
        render(<LoginView onLogin={vi.fn()} />);
        
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<LoginView onLogin={vi.fn()} />);
        
        const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    it('submits form and calls API', async () => {
        const mockOnLogin = vi.fn();
        
        // Mock successful API response
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'fake-token', user: { id: 1, name: 'Test User' } }),
        });

        render(<LoginView onLogin={mockOnLogin} />);

        fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'admin@realtyos.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/login'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ email: 'admin@realtyos.com', password: 'admin123' })
                })
            );
            expect(mockOnLogin).toHaveBeenCalled();
        });
    });

    it('displays error on failed login', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' }),
        });

        render(<LoginView onLogin={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
