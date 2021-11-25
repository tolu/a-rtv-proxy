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
  console.log('fetch from upstream', { upstreamUrl, origin });
  const res = await fetch(upstreamUrl, {
    headers: { ...headers, 'x-rikstv-application': 'Strim-Browser/4.0.991' },
    method,
    body,
  });
  // early return if not a-ok
  if (!res.ok || !(res.headers.get('content-type') ?? '').includes('application/json')) return res;

  // rewrite urls in response to our host
  const json = await res.json();
  const replacedText = JSON.stringify(json, null, 2).replaceAll(upstream, origin);

  // pick allowed headers from response
  const responseHeaders: Record<string, string> = {};
  for (let [key, value] of res.headers.entries()) {
    if (!['content-length', 'server', 'date'].includes(key)) {
      responseHeaders[key] = value;
    }
  }
  return new Response(replacedText, {
    headers: responseHeaders,
    status: res.status,
  });
}

console.log("Server started");
await serve(handler);