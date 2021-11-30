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
  const isArray = Array.isArray(data);
  switch (firstPathSegment) {
    case 'pages': {
      return isArray
      ? jsx(<PageList data={data} />)
      : jsx(await Page(data));
    }
  }
  
  return json({ error: 'no renderer for path/data', data}, { status: 404 });
};
