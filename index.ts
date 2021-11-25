import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const pathMapper = new Map<string, string>();
pathMapper.set('pages', 'https://contentlayout.rikstv.no/1');
pathMapper.set('menus', 'https://contentlayout.rikstv.no/1');
pathMapper.set('assets', 'https://contentsearch.rikstv.no/1');
pathMapper.set('client', 'https://api.rikstv.no/client/2');

function handler(_req: Request): Response {
  const { headers, method, url } = _req;

  const { pathname, search } = new URL(url);
  const upstream = pathMapper.get(pathname.split('/')[0]);

  if (!upstream) {
    return new Response(JSON.stringify({ message: `found no mapping for path: ${pathname}${search}` }), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 404
    });
  }

  return new Response(
    JSON.stringify({ req: {headers,method,url }, res: { upstream, pathAndQuery: pathname + search } }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

console.log("Listening on http://localhost:8000");
await serve(handler);