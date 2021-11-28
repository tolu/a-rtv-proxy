import { getTimeType, inRange, offsetInHoursFromNow } from '../utils/date.ts'
import type { ApiAsset, ApiEpisodeAsset } from '../types/ApiAsset.ts';
import { Image, mapImage } from './assetImageMapper.ts';

export const mapAsset = (assetList: ApiAsset[]) => {

  return assetList.map((asset) => {
    const { id, name, description, imdbRating, subscription: inSubscription } = asset;
    const mappedAsset: MappedAsset = {
      id,
      title: name,
      subtitle: [asset.productionYear, asset.genres?.[0]].filter(Boolean).join(' · '),
      description,
      imdbRating: imdbRating ? parseFloat(imdbRating.toFixed(1)) : null,
      image: mapImage(asset, isEpisodeAsset(asset)),
      inSubscription,
      providerLogoUrl: asset.originChannel.logoUrlSvgSquare,
      type: 'program', // TODO: how to set channel? check all assets are live now in list?
      style: 'default', // TODO: find a way to set somehow
      _links: {
        details: asset._links.details,
        series: asset._links.series
      }
    };

    // override and add properties for series
    if (isEpisodeAsset(asset)) {
      mappedAsset.id = asset.seriesId;
      mappedAsset.title = asset.seriesName;
      mappedAsset.subtitle += ` · ${asset.availableSeasons} sesong${asset.availableSeasons > 1 ? 'er' : ''}`
      mappedAsset.type = 'series';
    }

    if(isLiveEvent(asset)) {
      mappedAsset.type = 'event';
      mappedAsset.label = getTimeType(new Date(asset.broadcastedTime), asset.duration);
      mappedAsset.durationInSeconds = asset.duration;
      mappedAsset.startTimeEpoch = new Date(asset.broadcastedTime).getTime();
      // set url to channel details instead of epg
      mappedAsset._links.channel = { href: asset.originChannel._links.epg.href.replace(/epg$/, 'details') };
    }

    return {...mappedAsset, __originalAsset: asset};
  });
}

function isEpisodeAsset(asset: ApiAsset): asset is ApiEpisodeAsset {
  return (asset as any).seriesId != null;
}

function isLiveEvent(asset: ApiAsset): boolean {
  const broadCastDate = new Date(asset.broadcastedTime);
  const offsetHours = offsetInHoursFromNow(broadCastDate);
  return inRange(offsetHours, 0, 24) || inRange(offsetHours, -12, 0);
}

type MappedAsset = 
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
