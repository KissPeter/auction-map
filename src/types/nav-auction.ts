// Types for NAV auction listings
export type AuctionCategory = 'vehicle' | 'property' | 'art' | 'other';

export interface Auction {
  id: string;
  title: string;
  location: {
    lat: number;
    lng: number;
  };
  startDate: Date;
  endDate: Date;
  category: AuctionCategory;
  description: string;
  images?: string[];
}
