export interface Image {
  width: number;
  url: string;
  // type: 'wide'|'poster';
}

export type MappedAsset = 
  | MappedAssetBase
  | MappedEventAsset;

interface MappedAssetBase {
  id: string; // assetId | seriesId | channelId based on "type"
  title: string;
  image: Image[]; // image array with preselected sizes and image location (series, season, main)
  subtitle: string; // "Type · År · Sjanger"
  description: string;
  imdbRating: number | null; // 6.8
  inSubscription: boolean; // does the user have access to this content
  providerLogoUrl: string;
  type: 'program' | 'series' | 'channel' | 'event'; // for choosing appropriate select action
  style: 'default' | 'featured' | 'live'; // so that we can style the card
  _links: {
    details: { href: string; }
    series?: { href: string; } // set for series types
    channel?: { href: string; } // set for event/channel types
  }
  label?: string;
  startTimeEpoch?: number;
  durationInSeconds?: number;
}
interface MappedEventAsset extends MappedAssetBase {
  type: 'event';
  label: string;
  startTimeEpoch: number;
  durationInSeconds: number;
  _links: {
    details: { href: string; }
    channel: { href: string; }
    series?: { href: string; }
  }
}