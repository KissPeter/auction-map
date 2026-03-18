import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuctionFilterBar from '../AuctionFilterBar';

describe('AuctionFilterBar', () => {
  it('renders filter fields', () => {
    render(<AuctionFilterBar filter={{ dateRange: null, category: null }} setFilter={() => {}} />);
    expect(screen.getByLabelText(/Start Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/)).toBeInTheDocument();
  });
});
