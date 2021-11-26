import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { mapAsset } from './mappers/assetsMapper.ts';
import { cacheControl } from './utils/cacheControl.ts';

const upstreamServerMap = {
  layout: 'https://contentlayout.rikstv.no/1',
  search: 'https://contentsearch.rikstv.no/1',
  client: 'https://api.rikstv.no/client/2'
} as const;
const upstreamServerValues = Object.values(upstreamServerMap);
interface UpstreamSettings {
  server: string;
  dataMapper?: (input: any) => any;
  cacheControl?: string;
}
const pathConfig = new Map<string, UpstreamSettings>([
  ['pages', { server: upstreamServerMap.layout }],
  ['menus', { server: upstreamServerMap.layout }],
  ['assets', { server: upstreamServerMap.search, dataMapper: mapAsset, cacheControl: cacheControl({ setPrivate: true, maxAgeMinutes: 5 }) }],
  ['client', { server: upstreamServerMap.client }],
  ['ontvnow', { server: upstreamServerMap.client }],
]);

async function handler(_req: Request): Promise<Response> {
  // get upstream url base from first path segment
  const { headers, method, url, body } = _req;
  const { pathname, search, origin } = new URL(url);
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  const proxyConfig = pathConfig.get(firstPathSegment);

  // return 404 for unsupported path segments
  if (!proxyConfig) {
    return new Response(JSON.stringify({ message: `found no mapping for path: ${firstPathSegment}` }), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 404
    });
  }

  // fetch data from upstream
  const upstreamUrl = `${proxyConfig.server}${pathname}${search}`;
  console.log('fetch from upstream', { upstreamUrl, origin });
  const res = await fetch(upstreamUrl, {
    headers: { ...headers, 'x-rikstv-application': 'Strim-Browser/4.0.991' },
    method,
    body,
  });
  // early return if not a-ok
  if (!res.ok || !(res.headers.get('content-type') ?? '').includes('application/json')) return res;

  // map data
  let json = await res.json();
  if (proxyConfig.dataMapper) {
    json = proxyConfig.dataMapper(json);
  }
  // rewrite urls in response to our host
  const replacedText = upstreamServerValues.reduce((result, upstreamServer) => {
    return result.replaceAll(upstreamServer, origin);
  }, JSON.stringify(json, null, 2));

  // pick allowed headers from response
  const responseHeaders: Record<string, string> = {};
  for (let [key, value] of res.headers.entries()) {
    if (!['content-length', 'server', 'date'].includes(key)) {
      responseHeaders[key] = value;
    }
  }
  // add specific private cache per endpoint
  if (proxyConfig.cacheControl) {
    responseHeaders['cache-control'] = proxyConfig.cacheControl;
  }
  // default cache for anonymous calls
  if (res.headers.has('authorization')) {
    responseHeaders['cache-control'] = cacheControl({ maxAgeMinutes: 5 });
  }

  return new Response(replacedText, {
    headers: responseHeaders,
    status: res.status,
  });
}

console.log("Server started");
await serve(handler);