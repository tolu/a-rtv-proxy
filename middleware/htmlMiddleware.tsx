import { useMappingMiddlewareHandler } from './mappingMiddleware.ts';
import { appShell } from '../utils/html.ts';
import { PageList, Page } from '../types/ApiPages.ts';
import type { MappedAsset } from '../types/MappedAsset.ts';

export const useHtmlMiddlewareHandler = (url: string) => {
  const { pathname } = new URL(url);
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  return firstPathSegment === 'html' && useMappingMiddlewareHandler(url.replace('/html', ''));
}

export const htmlMiddlewareHandler = async (_req: Request) => {
  const dataPath = _req.url.replace('/html', '');
  const res = await fetch(dataPath);
  
  if (!res.ok) {
    return new Response('', { status: 404 });
  }

  let firstPathSegment = (new URL(dataPath)).pathname.split('/').filter(Boolean)[0];
  const data = await res.json();
  if (firstPathSegment === 'pages' && !Array.isArray(data)) {
    firstPathSegment = 'page';
  }

  const renderer = templateMap.get(firstPathSegment) ?? defaultRenderer;

  const html = appShell(await renderer(data));
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const templateMap = new Map<string, (input: any) => Promise<string>>([
  ['pages', pageListRenderer],
  ['page', pageRenderer]
]);

function defaultRenderer(data: any) {
  return /*html*/`<main><pre>${JSON.stringify(data, null, 2)}</pre></main>`;
}

async function pageListRenderer(pageList: PageList) {
  return /*html*/`
    <h1>Pages</h1>
    <ul style="display: flex;">
      ${ pageList.map(p => /*html*/`
        <a href="${p.link.replace('/pages/','/html/pages/')}" style="padding: 1rem;">${p.name}</a>
      `).join('') }
    </ul>
  `.trim();
}

async function pageRenderer({title, swimlanes }: Page) {
  const supportedLanes = swimlanes.filter(s => s.type !== 'Menu').slice(1, 5);
  const assetLists = await Promise.all(supportedLanes.map(async (list) => {
    const items = await (await fetch(list.link)).json();
    return { ...list, items };
  }));

  return /*html*/`
    <h1>Page: ${title}</h1>
    <div style="display: flex; flex-direction: column">
    ${ assetLists.map(s => /*html*/`
      <div>
        <h2>${s.name} (${s.type} : ${s.style})</h2>
        <div style="overflow-x: auto; display: flex" class="swimlane">
        ${ s.items.map(itemRenderer).join('') }
        </div>
      </div>
    `).join('') }
    </div>
  `.trim();
}

function itemRenderer(item: MappedAsset) {
  const startTime = item.startTimeEpoch ? new Date(item.startTimeEpoch) : null;
  const endTime = item.startTimeEpoch && item.durationInSeconds ? new Date(item.startTimeEpoch + item.durationInSeconds * 1000) : null;
  return /*html*/`
  <div style="margin-right: 1rem; position: relative">
    <div style="position:relative" class="image-wrapper">
      <picture>
        <img width="300" loading="lazy" src="${item.image[0].url}" />
      </picture>
      <img src="${item.providerLogoUrl}" width="40" style="border-radius: 50vw; position: absolute; right: 10px; top: 10px;" />
      ${renderProgressBar(startTime, endTime)}
    </div>
    <h3>${item.title}</h3>
    <p class="hover">${item.subtitle}</p>
  </div>
  `.trim();
}

function renderProgressBar(start: Date | null, end: Date | null) {
  if (!start || !end) return '';
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = end.getTime();
  if (now > endTime) return '';
  if (now < startTime) return '';
  const progress = Math.round((now - startTime) / (endTime - startTime) * 100);
  return /*html*/`<div style="border-radius: 50vw; overflow: hidden; background: rgba(100 100 100 / 50%); position: relative; bottom: 13px; width: 95%; margin: auto;">
    <div style="height: 5px; width: ${progress}%; background: rgba(255 255 0 / 75%);"></div>
  </div>`;
}
