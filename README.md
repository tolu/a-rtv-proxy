# a-rtv-proxy

`a-rtv-proxy` is a [deno deploy](https://deno.com/deploy/docs) powered service for prototyping RTV's vNext client API

> Main goal: slimmed down interface to reduce client side logic and choices

- [x] add proxying for layout, search and client API's
- [x] return 404 for routes that are not mapped
- [x] add feature for mapping a specific response
- [x] add private cache headers to simplify client logic
- [ ] discuss interface with other client developers

```ts
// current interface mapping for swimlane content (not menu items)
interface SwimlaneItem {
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
```
