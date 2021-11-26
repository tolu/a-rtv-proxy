
const getImageSizeMapper = (image: string, location: ''|'series-main' = '') => {
  const url = new URL(image);
  return (width: number) => {
    url.searchParams.set('width', width.toString());
    url.searchParams.delete('location');
    location && url.searchParams.set('location', location);
    return {
      width,
      url: url.toString(),
    }
  }
}



export const mapAsset = (assetList: Asset[]) => {
  return assetList.map((asset) => {
    const { id, name, imagePackUri, duration, description, imdbRating, subscription: inSubscription } = asset;
    const mappedAsset: MappedAsset = {
      id,
      title: name,
      subtitle: [asset.productionYear, asset.genres[0]].filter(Boolean).join(' · '),
      description,
      imdbRating: parseFloat(imdbRating.toFixed(1)),
      image: [300, 600].map(getImageSizeMapper(imagePackUri)),
      inSubscription,
      providerLogoUrl: asset.originChannel.logoUrlSvgSquare,
      type: 'program', // TODO: how to set channel? From url context maybee
      style: 'default', // TODO: find a way to set somehow
      __links: asset.__links
    };

    // override and add properties for series
    if (isEpisodeAsset(asset)) {
      mappedAsset.id = asset.seriesId;
      mappedAsset.title = asset.seriesName;
      mappedAsset.image = [300, 600].map(getImageSizeMapper(imagePackUri, 'series-main'));
      mappedAsset.subtitle += ` · ${asset.availableSeasons} sesong${asset.availableSeasons > 1 ? 'er' : ''}`
      mappedAsset.type = 'series';
    }

    return {...mappedAsset, __originalAsset: asset};
  });
}

function isEpisodeAsset(asset: Asset): asset is EpisodeAsset {
  return (asset as any).seriesId != null;
}

interface Image {
  width: number;
  url: string;
  // type: 'wide'|'poster';
}
interface MappedAsset {
  id: string; // assetId | seriesId | channelId based on "type"
  title: string;
  image: Image[]; // image array with preselected sizes and image location (series, season, main)
  subtitle: string; // "Type · År · Sjanger"
  description: string;
  imdbRating: number; // 6.8
  inSubscription: boolean; // does the user have access to this content
  providerLogoUrl: string;
  type: 'channel' | 'program' | 'series'; // for choosing appropriate select action
  style: 'default' | 'featured' | 'live'; // so that we can style the card
  __links: {
    details: { href: string; }
    series?: { href: string; } // set for series
    channel?: { href: string; } // set for live content
  }
}
type Asset = ProgramAsset | EpisodeAsset; 
interface ProgramAsset {
  id: string;
  name: string;
  imagePackUri: string;
  duration: number;
  description: string;
  imdbRating: number;
  broadcastedTime: string; // "2021-11-25T22:30:00Z"
  productionYear: number;
  genres: string[];
  subscription: boolean;
  originChannel: {
    logoUrlSvgSquare: string;
  }
  __links: {
    details: { href: string }
    series?: { href: string }
  }
}
interface EpisodeAsset extends ProgramAsset {
  seriesName: string;
  episode: number;
  availableSeasons: number;
  seriesId: string;
  season?: number;
  // unused
  episodeCount: number;
  availableEpisodes: number;
  seasonDescription?: string;
}