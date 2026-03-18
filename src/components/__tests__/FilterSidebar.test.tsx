import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FilterSidebar, FilterState } from '../FilterSidebar';

const sampleData = [
  { type: 'NAV', status: 'active' },
  { type: 'NAV', status: 'expired' },
  { type: 'MNV', status: 'active' },
  { type: 'EER', status: 'active' },
  { type: 'EER', status: 'expired' }
];

describe('FilterSidebar', () => {
  it('renders all filter options and counts', () => {
    const onFilter = jest.fn();
    const { getByText } = render(
      <FilterSidebar auctionData={sampleData} onFilter={onFilter} />
    );
    expect(getByText('NAV (2)')).toBeInTheDocument();
    expect(getByText('EER (2)')).toBeInTheDocument();
    expect(getByText('MNV (1)')).toBeInTheDocument();
    expect(getByText('Active (3)')).toBeInTheDocument();
    expect(getByText('Expired (2)')).toBeInTheDocument();
  });

  it('toggles filters and persists in localStorage', () => {
    const onFilter = jest.fn();
    const { getByLabelText } = render(
      <FilterSidebar auctionData={sampleData} onFilter={onFilter} />
    );
    const navCheckbox = getByLabelText('NAV (2)');
    fireEvent.click(navCheckbox);
    expect(onFilter).toHaveBeenCalledWith(expect.objectContaining({ types: expect.not.arrayContaining(['NAV']) }));
    // localStorage check
    expect(JSON.parse(window.localStorage.getItem('auctionMapFilterSidebar'))).not.toEqual(expect.objectContaining({ types: expect.arrayContaining(['NAV']) }));
  });

  it('collapses and expands sidebar', () => {
    const onFilter = jest.fn();
    const { getByTitle } = render(
      <FilterSidebar auctionData={sampleData} onFilter={onFilter} />
    );
    const toggleBtn = getByTitle('Collapse');
    fireEvent.click(toggleBtn);
    expect(getByTitle('Expand')).toBeInTheDocument();
  });
});
