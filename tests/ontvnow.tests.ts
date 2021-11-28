import { mapAsset } from '../mappers/assetsMapper.ts'

console.log('Deno.cwd()', Deno.cwd());
const data = JSON.parse(Deno.readTextFileSync('./tests/data/ontvnow.json'));

Deno.test('map ontvnow without throwing', () => {
  mapAsset(data);
});