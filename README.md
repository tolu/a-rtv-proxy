# a-rtv-proxy

`a-rtv-proxy` is a [deno deploy](https://deno.com/deploy/docs) powered service for prototyping RTV's vNext client API

> Main goal: slimmed down interface to reduce client side logic and choices

- [x] add proxying for layout, search and client API's
- [x] return 404 for routes that are not mapped
- [x] add feature for mapping a specific response
- [x] add private cache headers to simplify client logic
- [ ] discuss interface with other client developers

## How-to `deno`

> See [deno installation docs](https://deno.land/manual/getting_started/installation) first

Start local server

```sh
deno run -A index.ts
```

Run integration tests

```sh
deno test -A
```

## Interface

```ts
// current interface mapping for swimlane content (not menu items)
interface MappedAsset {
  id: string; // assetId | seriesId | channelId based on "type"
  title: string;
  image: Image[]; // image array with preselected sizes and image location (series, season, main)
  subtitle: string; // "Type · År · Sjanger"
  description: string;
  imdbRating: number; // 6.8
  inSubscription: boolean; // does the user have access to this content
  providerLogoUrl: string;
  type: 'program' | 'series' | 'event' | 'channel'; // for choosing appropriate select action
  style: 'default' | 'featured' | 'live'; // so that we can style the card
  _links: {
    details: { href: string; }
    series?: { href: string; } // set for series
    channel?: { href: string; } // set for event/live types
  }
  label?: string;  // Set for event types
  startTimeEpoch?: number; // Set for event/live types
  durationInSeconds?: number; // Set for event/live types
}
```
