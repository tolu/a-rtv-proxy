import { mapAsset } from '../mappers/assetsMapper.ts'

Deno.test('map ontvnow without throwing', async () => {
  const onTvNowRes = await fetch('https://api.rikstv.no/client/2/ontvnow/titles');
  mapAsset(await onTvNowRes.json());
});