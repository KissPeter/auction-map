import React from 'react';
import { AuctionCategory } from '../types/nav-auction';

interface Filter {
  dateRange: [Date, Date] | null;
  category: AuctionCategory | null;
}

interface Props {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

const AuctionFilterBar: React.FC<Props> = ({ filter, setFilter }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, idx: 0 | 1) => {
    const date = new Date(e.target.value);
    if (filter.dateRange) {
      const newRange: [Date, Date] = [...filter.dateRange];
      newRange[idx] = date;
      setFilter({ ...filter, dateRange: newRange });
    } else {
      setFilter({ ...filter, dateRange: idx === 0 ? [date, new Date()] : [new Date(), date] });
    }
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, category: e.target.value as AuctionCategory });
  };

  return (
    <div className="filter-bar">
      <label>
        Start Date:{' '}
        <input type="date" onChange={(e) => handleDateChange(e, 0)} />
      </label>
      <label>
        End Date:{' '}
        <input type="date" onChange={(e) => handleDateChange(e, 1)} />
      </label>
      <label>
        Category:{' '}
        <select onChange={handleCategoryChange} value={filter.category || ''}>
          <option value="">All</option>
          <option value="vehicle">Vehicle</option>
          <option value="property">Property</option>
          <option value="art">Art</option>
          <option value="other">Other</option>
        </select>
      </label>
    </div>
  );
};
export default AuctionFilterBar;
