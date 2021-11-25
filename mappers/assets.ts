
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
    const { id, name, imagePackUri, duration, description, imdbRating } = asset;
    const images = [300, 600].map(getImageSizeMapper(imagePackUri));
    const mappedAsset: MappedAsset = {
      title: name,
      description,
      duration,
      imdbRating: parseFloat(imdbRating.toFixed(1)),
      link: `https://www.strim.no/watch/vod/${id}`,
    };

    // override and add properties for series
    if (isEpisodeAsset(asset)) {
      mappedAsset.link = `https://www.strim.no/watch/seriesoverview/${asset.seriesId}`;
      mappedAsset.series = {
        title: asset.seriesName,
        episode: asset.season ? `s${asset.season.toFixed().padStart(2, '0')}:e${asset.episode.toFixed().padStart(2, '0')}` : asset.broadcastedTime.substr(0, 10),
        availableSeasons: asset.availableSeasons,
        images: [300, 600].map(getImageSizeMapper(imagePackUri, 'series-main')),
      }
    }

    return {...mappedAsset, images, __originalAsset: asset};
  });
}

function isEpisodeAsset(asset: Asset): asset is EpisodeAsset {
  return (asset as any).seriesId != null;
}
interface MappedAsset {
  title: string;
  duration: number;
  description: string;
  imdbRating: number;
  link: string;
  images?: Array<{width: number, url: string}>;
  series?: {
    title: string;
    episode: string;
    availableSeasons: number;
    images: Array<{width: number, url: string}>;
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