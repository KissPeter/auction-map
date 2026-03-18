import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NAVAuctionMap from '../NAVAuctionMap';

jest.mock('../../services/nav-auction-api', () => ({
  fetchAuctions: jest.fn().mockResolvedValue([
    {
      id: '1',
      title: 'Test Auction',
      location: { lat: 47.5, lng: 19.04 },
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-05'),
      category: 'vehicle',
      description: 'A test auction for vehicles.',
      images: ['test.jpg'],
    },
  ]),
}));

describe('NAVAuctionMap', () => {
  it('renders loading and then auctions', async () => {
    render(<NAVAuctionMap />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Test Auction/)).toBeInTheDocument());
  });
});
