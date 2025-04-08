import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

// Mocking react-query hooks
vi.mock('../lib/hooks', () => ({
  useLogEntries: () => ({ data: [], isLoading: false }),
  useLogEntryMutations: () => ({
    createMutation: { isPending: false },
    updateMutation: { isPending: false },
    deleteMutation: { isPending: false }
  })
}));

describe('Home component - New Entry button', () => {
  it('should show new entry form when the New Entry button is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
    
    // Check that initially the form is not visible
    expect(screen.queryByText('Add New Log Entry')).toBeNull();
    
    // Find and click the New Entry button
    const newEntryButton = screen.getByText('New Entry');
    fireEvent.click(newEntryButton);
    
    // Verify the form is now visible
    expect(screen.getByText('Add New Log Entry')).toBeInTheDocument();
  });
});
