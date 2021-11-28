export type ApiAsset = ApiProgramAsset | ApiEpisodeAsset; 
export interface ApiProgramAsset {
  id: string;
  name: string;
  imagePackUri?: string; // null for ontvnow when no broadcast for channel
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
      epg: Link;
      placeholderImage: Link;
    }
  }
  _links: {
    details: Link;
    series?: Link;
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
interface Link {
  href: string;
}