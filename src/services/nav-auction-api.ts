import { Auction } from '../types/nav-auction';

// Dummy fetch call for illustration; replace with actual endpoint integration
export async function fetchAuctions(): Promise<Auction[]> {
  // This simulates fetching from a real API. Use actual endpoint when available.
  const resp = await fetch('/api/nav-auctions');
  if (!resp.ok) throw new Error('Failed to fetch auctions');
  const items = await resp.json();
  return items.map((a: any) => ({
    ...a,
    startDate: new Date(a.startDate),
    endDate: new Date(a.endDate),
  }));
}
