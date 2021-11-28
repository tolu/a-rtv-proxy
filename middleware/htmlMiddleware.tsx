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
  const assetLists = await Promise.all(swimlanes.slice(1, 5).map(async (list) => {
    const items = await (await fetch(list.link)).json();
    return { ...list, items };
  }));

  return /*html*/`
    <h1>Page: ${title}</h1>
    <div style="display: flex; flex-direction: column">
    ${ assetLists.map(s => /*html*/`
      <div>
        <h2>${s.name} (${s.type} : ${s.style})</h2>
        <div style="overflow-x: auto; display: flex">
        ${ s.items.map(itemRenderer).join('') }
        </div>
      </div>
    `).join('') }
    </div>
  `.trim();
}

function itemRenderer(item: MappedAsset) {
  return /*html*/`
  <div style="margin-right: 1rem">
    <picture width="300">
      <img src="${item.image[0].url}" />
    </picture>
  </div>
  `.trim();
}
