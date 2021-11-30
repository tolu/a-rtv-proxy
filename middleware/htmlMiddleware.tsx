/** @jsx h */
import {
  fetchViaMiddleware,
} from './mappingMiddleware.ts';
import { PageList } from '../components/PageList.tsx';
import { Page } from '../components/Page.tsx';
import { json, h, jsx } from '../deps.ts';

export const htmlMiddlewareHandler = async (_req: Request) => {
  const dataPath = _req.url.replace('/html', '');

  const res = await fetchViaMiddleware(dataPath, _req.headers);

  if (res.ok !== true) {
    return new Response(JSON.stringify(res), { status: 404 });
  }

  let firstPathSegment =
    (new URL(dataPath)).pathname.split('/').filter(Boolean)[0];
  const data = await res.json();
  if (firstPathSegment === 'pages' && !Array.isArray(data)) {
    firstPathSegment = 'page';
  }

  switch (firstPathSegment) {
    case 'pages': return jsx(<PageList data={data} />)
    case 'page': return jsx(await Page(data)); // must call as function since async
  }
  
  return json({ error: 'no renderer for path/data', data}, { status: 404 });
};
