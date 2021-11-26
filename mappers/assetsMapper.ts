
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
    const mappedAsset: Partial<MappedAsset> = {
      title: name,
      description,
      imdbRating: parseFloat(imdbRating.toFixed(1)),
      link: `https://www.strim.no/watch/vod/${id}`,
    };

    // override and add properties for series
    if (isEpisodeAsset(asset)) {
      mappedAsset.link = `https://www.strim.no/watch/seriesoverview/${asset.seriesId}`;
      mappedAsset.series = {
        title: asset.seriesName,
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
  description: string;
  imdbRating: number;
  link: string;
  images: Array<{width: number, url: string}>;
  series?: {
    title: string;
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