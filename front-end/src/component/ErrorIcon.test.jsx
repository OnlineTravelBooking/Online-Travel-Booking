import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorIcon from './ErrorIcon'; // ปรับเส้นทางนำเข้าให้ถูกต้อง
import React from 'react';

// Mock window.location.reload
vi.stubGlobal('location', {
    reload: vi.fn(),
});

describe('ErrorIcon', () => {
    it('renders without crashing', () => {
        render(<ErrorIcon error={{ message: 'Test error' }} />);
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('displays default error message when no message provided', () => {
        render(<ErrorIcon error={{}} />);
        expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    it('displays custom error message when provided', () => {
        const errorMessage = 'Custom error message';
        render(<ErrorIcon error={{ message: errorMessage }} />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders reload button and handles click', () => {
        render(<ErrorIcon error={{ message: 'Test' }} />);
        const button = screen.getByRole('button', { name: /reload/i });
        button.click();
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('has document', () => {
        expect(document).toBeDefined(); // ตรวจสอบว่า document มีอยู่
    });
});