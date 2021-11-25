import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const pathMapper = new Map<string, string>();
pathMapper.set('pages', 'https://contentlayout.rikstv.no/1');
pathMapper.set('menus', 'https://contentlayout.rikstv.no/1');
pathMapper.set('assets', 'https://contentsearch.rikstv.no/1');
pathMapper.set('client', 'https://api.rikstv.no/client/2');

async function handler(_req: Request): Promise<Response> {
  const { headers, method, url, body } = _req;

  const { pathname, search } = new URL(url);
  console.log('got request:', { pathname, search });
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  const upstream = pathMapper.get(firstPathSegment);

  if (!upstream) {
    return new Response(JSON.stringify({ message: `found no mapping for path: ${firstPathSegment}` }), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 404
    });
  }

  const upstreamUrl = `${upstream}${pathname}`;
  return await fetch(upstreamUrl, {
    headers: { ...headers, 'x-rikstv-application': 'Strim-Browser/4.0.991' },
    method,
    body,
  });
}

console.log("Listening on http://localhost:8000");
await serve(handler);