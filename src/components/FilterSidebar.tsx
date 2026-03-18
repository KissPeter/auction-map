import React, { useState, useEffect } from 'react';
import './FilterSidebar.css';

const AUCTION_TYPES = ['NAV', 'EER', 'MNV'];
const AUCTION_STATUSES = ['active', 'expired'];

export interface FilterState {
  types: string[];
  statuses: string[];
}

interface FilterSidebarProps {
  auctionData: any[]; // unified model from Issue #8
  onFilter: (filters: FilterState) => void;
}

const FILTER_STATE_KEY = 'auctionMapFilterSidebar';

function getCounts(data: any[], field: string, options: string[]): { [option: string]: number } {
  const counts: { [option: string]: number } = {};
  for (const option of options) {
    counts[option] = data.filter(item => item[field] === option).length;
  }
  return counts;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ auctionData, onFilter }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      return JSON.parse(localStorage.getItem(FILTER_STATE_KEY) || '') || {
        types: AUCTION_TYPES,
        statuses: AUCTION_STATUSES
      };
    } catch {
      return {
        types: AUCTION_TYPES,
        statuses: AUCTION_STATUSES
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(filters));
    onFilter(filters);
  }, [filters, onFilter]);

  // Counts
  const typeCounts = getCounts(auctionData, 'type', AUCTION_TYPES);
  const statusCounts = getCounts(auctionData, 'status', AUCTION_STATUSES);

  const toggleCollapsed = () => setCollapsed(c => !c);

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type) ? prev.types.filter(t => t !== type) : [...prev.types, type],
    }));
  };

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status) ? prev.statuses.filter(s => s !== status) : [...prev.statuses, status],
    }));
  };

  return (
    <div className={`filter-sidebar${collapsed ? ' collapsed' : ''}`}> 
      <button className="sidebar-toggle" onClick={toggleCollapsed} title={collapsed ? 'Expand' : 'Collapse'}>{collapsed ? '▶️' : '◀️'}</button>
      {!collapsed && (
        <div className="filter-panel">
          <h3>Filter Auctions</h3>
          <div className="filter-section">
            <strong>Type</strong>
            <ul>
              {AUCTION_TYPES.map(type => (
                <li key={type}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                    />
                    {type} <span className="count">({typeCounts[type]})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-section">
            <strong>Status</strong>
            <ul>
              {AUCTION_STATUSES.map(status => (
                <li key={status}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)} <span className="count">({statusCounts[status]})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {/* Extendable: add other filter fields here */}
        </div>
      )}
    </div>
  );
};
