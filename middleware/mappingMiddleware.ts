import { mapAsset } from '../mappers/assetsMapper.ts';
import { cacheControl } from '../utils/cacheControl.ts';

export const useMappingMiddlewareHandler = (url: string) => {
  const { pathname } = new URL(url);
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  return pathConfig.has(firstPathSegment);
};

export const mappingMiddlewareHandler = async (_req: Request) => {
  // get upstream url base from first path segment
  const { headers, method, url, body } = _req;
  const { pathname, search, origin } = new URL(url);
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  const proxyConfig = pathConfig.get(firstPathSegment)!;

  const upstreamUrl = `${proxyConfig.server}${pathname}${search}`;
  console.log('fetch from upstream', { upstreamUrl, origin });
  const res = await fetch(upstreamUrl, {
    headers: {
      ...headers,
      'x-rikstv-application': 'Strim-Browser/4.0.991',
    },
    method,
    body,
  });
  // early return if not a-ok
  if (
    !res.ok ||
    !(res.headers.get('content-type') ?? '').includes('application/json')
  ) {
    return res;
  }

  // map data
  let json = await res.json();
  if (proxyConfig.dataMapper) {
    json = proxyConfig.dataMapper(json);
  }
  // rewrite urls in response to our host
  const replacedText = upstreamServerValues.reduce(
    (result, upstreamServer) => {
      return result.replaceAll(upstreamServer, origin);
    },
    JSON.stringify(json, null, 2),
  );

  // pick allowed headers from response
  const responseHeaders: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    if (!['content-length', 'server', 'date'].includes(key)) {
      responseHeaders[key] = value;
    }
  });

  // add specific private cache per endpoint
  if (proxyConfig.cacheControl) {
    responseHeaders['cache-control'] = proxyConfig.cacheControl;
  }
  // default cache for anonymous calls
  if (!headers.has('authorization')) {
    responseHeaders['cache-control'] = cacheControl({ maxAgeMinutes: 5 });
  }

  return new Response(replacedText, {
    headers: responseHeaders,
    status: res.status,
  });
};

const upstreamServerMap = {
  layout: 'https://contentlayout.rikstv.no/1',
  search: 'https://contentsearch.rikstv.no/1',
  client: 'https://api.rikstv.no/client/2',
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
  ['assets', {
    server: upstreamServerMap.search,
    dataMapper: mapAsset,
    cacheControl: cacheControl({ setPrivate: true, maxAgeMinutes: 5 }),
  }],
  ['client', { server: upstreamServerMap.client }],
  ['ontvnow', { server: upstreamServerMap.client, dataMapper: mapAsset }],
]);
