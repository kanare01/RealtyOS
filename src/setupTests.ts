
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch globally
globalThis.fetch = vi.fn();

// Mock LocalStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function(key: string) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window interactions
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(window, 'alert', { value: vi.fn(), writable: true });
Object.defineProperty(window, 'confirm', { value: vi.fn(() => true), writable: true }); // Default confirm to true

// Mock URL for file downloads
window.URL.createObjectURL = vi.fn(() => 'mock-url');
window.URL.revokeObjectURL = vi.fn();
