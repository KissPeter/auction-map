import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Auction, AuctionCategory } from '../types/nav-auction';
import { fetchAuctions } from '../services/nav-auction-api';
import AuctionFilterBar from './AuctionFilterBar';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';

function getAuctionIcon(category: string) {
  // Basic icon customization by category
  return L.icon({
    iconUrl:
      category === 'vehicle'
        ? '/icons/car.svg'
        : '/icons/auction.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const NAVAuctionMap: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ dateRange: [Date, Date] | null; category: AuctionCategory | null }>({ dateRange: null, category: null });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAuctions()
      .then((data) => {
        setAuctions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch auctions.');
        setLoading(false);
      });
  }, []);

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      const inCategory = filter.category ? auction.category === filter.category : true;
      const inDateRange = filter.dateRange
        ? auction.startDate >= filter.dateRange[0] && auction.endDate <= filter.dateRange[1]
        : true;
      return inCategory && inDateRange;
    });
  }, [auctions, filter]);

  const positions = filteredAuctions.map((a) => [a.location.lat, a.location.lng]);

  function MapZoomToAuctions({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
      if (positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }, [positions, map]);
    return null;
  }

  return (
    <div className="nav-auction-map">
      <AuctionFilterBar filter={filter} setFilter={setFilter} />
      {loading && <div className="loading">Loading auctions...</div>}
      {error && <div className="error">{error}</div>}
      <MapContainer style={{ height: '600px', width: '100%' }} center={[47.4979, 19.0402]} zoom={7} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        <MapZoomToAuctions positions={positions} />
        <MarkerClusterGroup>
          {filteredAuctions.map((auction) => (
            <Marker
              key={auction.id}
              position={[auction.location.lat, auction.location.lng]}
              icon={getAuctionIcon(auction.category)}
            >
              <Popup>
                <div className="auction-popup">
                  <h4>{auction.title}</h4>
                  <img src={auction.images?.[0]} alt={auction.title} style={{ width: '100%', maxWidth: '200px' }} />
                  <p>{auction.description}</p>
                  <strong>Category: </strong>{auction.category}<br />
                  <strong>Start: </strong>{auction.startDate.toLocaleDateString()}<br />
                  <strong>End: </strong>{auction.endDate.toLocaleDateString()}<br />
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default NAVAuctionMap;
