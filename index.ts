import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const pathMapper = new Map<string, string>();
pathMapper.set('pages', 'https://contentlayout.rikstv.no/1');
pathMapper.set('menus', 'https://contentlayout.rikstv.no/1');
pathMapper.set('assets', 'https://contentsearch.rikstv.no/1');
pathMapper.set('client', 'https://api.rikstv.no/client/2');

async function handler(_req: Request): Promise<Response> {
  // get upstream url base from first path segment
  const { headers, method, url, body } = _req;
  const { pathname, search, origin } = new URL(url);
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  const upstream = pathMapper.get(firstPathSegment);

  // return 404 for unsupported path segments
  if (!upstream) {
    return new Response(JSON.stringify({ message: `found no mapping for path: ${firstPathSegment}` }), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 404
    });
  }

  // fetch data from upstream
  const upstreamUrl = `${upstream}${pathname}${search}`;
  console.log('fetch from upstream', { upstreamUrl });
  const res = await fetch(upstreamUrl, {
    headers: { ...headers, 'x-rikstv-application': 'Strim-Browser/4.0.991' },
    method,
    body,
  });
  // early return if not a-ok
  console.log('got headers', { headers: res.headers });
  if (!res.ok || !(res.headers.get('content-type') ?? '').includes('application/json')) return res;

  // rewrite urls in response to our host
  const json = await res.json();
  console.log('got json from proxy', json);
  const replacedText = JSON.stringify(json).replaceAll(upstream, origin);

  return new Response(replacedText, {
    headers: res.headers,
    status: res.status,
    statusText: res.statusText,
  });
}

console.log("Server started");
await serve(handler);