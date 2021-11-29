import { useMappingMiddlewareHandler } from './mappingMiddleware.ts';
import { appShell } from '../utils/html.ts';
import { pageListRenderer } from '../components/PageList.tsx';
import { pageRenderer } from '../components/Page.tsx';

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

const templateMap = new Map<string, (input: any) => string | Promise<string>>([
  ['pages', pageListRenderer],
  ['page', pageRenderer]
]);

function defaultRenderer(data: any) {
  return /*html*/`<main><pre>${JSON.stringify(data, null, 2)}</pre></main>`;
}
