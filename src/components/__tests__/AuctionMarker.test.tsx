import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AuctionMarker from '../AuctionMarker';

describe('AuctionMarker', () => {
  it('renders marker with count badge', () => {
    const { getByText } = render(<AuctionMarker lat={47.5} lng={19.1} count={3} />);
    expect(getByText('3')).toBeInTheDocument();
  });

  it('renders clustered badge style', () => {
    const { container } = render(<AuctionMarker lat={47.5} lng={19.1} count={12} clustered />);
    const badge = container.querySelector('.count-badge.clustered');
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toBe('12');
  });

  it('calls onClick when marker is clicked', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<AuctionMarker lat={47.5} lng={19.1} count={1} onClick={onClick} />);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
