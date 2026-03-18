import React from 'react';

interface AuctionMarkerProps {
  lat: number;
  lng: number;
  count: number;
  clustered?: boolean;
  onClick?: () => void;
}

/**
 * AuctionMarker component renders a marker with a count badge.
 * If clustered is true, shows a clustering style (e.g. larger badge).
 */
const AuctionMarker: React.FC<AuctionMarkerProps> = ({
  count,
  clustered = false,
  onClick,
}) => {
  return (
    <div
      className={`auction-marker${clustered ? ' clustered' : ''}`}
      onClick={onClick}
      role="button"
      aria-label={`Auction marker with ${count} auctions`}
      tabIndex={0}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="#3170AD" stroke="#fff" strokeWidth="2" />
      </svg>
      <span className={`count-badge${clustered ? ' clustered' : ''}`}>{count}</span>
    </div>
  );
};

export default AuctionMarker;
