import { useMappingMiddlewareHandler, mappingMiddlewareHandler } from './mappingMiddleware.ts';
import { appShell } from '../utils/html.ts';
import { pageListRenderer } from '../components/PageList.tsx';
import { pageRenderer } from '../components/Page.tsx';

export const useHtmlMiddlewareHandler = (url: string) => {
  const { pathname } = new URL(url);
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  return firstPathSegment === 'html' &&
    useMappingMiddlewareHandler(url.replace('/html', ''));
};

export const htmlMiddlewareHandler = async (_req: Request) => {
  const dataPath = _req.url.replace('/html', '');

  const res = await mappingMiddlewareHandler({ headers: _req.headers, method: _req.method, url: dataPath });

  if (res.ok !== true) {
    return new Response(JSON.stringify(res), { status: 404 });
  }

  let firstPathSegment =
    (new URL(dataPath)).pathname.split('/').filter(Boolean)[0];
  const data = await res.json();
  if (firstPathSegment === 'pages' && !Array.isArray(data)) {
    firstPathSegment = 'page';
  }
  
  console.log('got data', {data});
  
  try {

    const renderer = templateMap.get(firstPathSegment) ?? defaultRenderer;
    console.log(1);
    const markup = await renderer(data);
    console.log(2);
    const html = appShell(markup);
    console.log(3);
  
    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ msg: 'oopsie', err}, null, 2));
  }
};

const templateMap = new Map<string, (input: any) => string | Promise<string>>([
  ['pages', pageListRenderer],
  ['page', pageRenderer],
]);

function defaultRenderer(data: any) {
  return /*html*/ `<main><pre>${JSON.stringify(data, null, 2)}</pre></main>`;
}
