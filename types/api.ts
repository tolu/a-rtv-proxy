export type ApiAsset = ApiProgramAsset | ApiEpisodeAsset; 
export interface ApiProgramAsset {
  id: string;
  name: string;
  imagePackUri: string;
  duration: number;
  description: string;
  imdbRating?: number;
  broadcastedTime: string; // "2021-11-25T22:30:00Z"
  productionYear: number;
  genres: string[];
  subscription: boolean;
  inCatchupArchive: boolean;
  originChannel: {
    channelId: number;
    logoUrlSvgSquare: string;
    _links: {
      epg: { href: string }
    }
  }
  _links: {
    details: { href: string }
    series?: { href: string }
  }
}
export interface ApiEpisodeAsset extends ApiProgramAsset {
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