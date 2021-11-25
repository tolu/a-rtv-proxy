export const mapAsset = (assetList: Asset[]) => {
  return assetList.map((asset) => {
    const { id, name, imagePackUri, duration, description, imdbRating } = asset;
    return {
      id, name, imagePackUri, duration, description, imdbRating,
      __originalAsset: asset
    };
  });
}

interface Asset {
  id: string;
  name: string;
  imagePackUri: string;
  duration: number;
  description: string;
  imdbRating: number;
  // potential series properties
  seriesName?: string;
  seasonDescription?: string;
  season?: number;
  episode?: number;
  availableSeasons?: number;
  seriesId?: string;

  // unused
  episodeCount?: number;
  availableEpisodes?: number;
}