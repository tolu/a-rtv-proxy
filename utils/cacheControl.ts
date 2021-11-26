interface CacheOptions {
  setPrivate?: boolean;
  maxAgeMinutes: number;
}
export const cacheControl = ({ setPrivate = false, maxAgeMinutes }: CacheOptions) => {
  return `${setPrivate ? 'private' : 'public'}, max-age=${maxAgeMinutes * 60}`;
}