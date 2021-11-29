/* must be included in some file for tsx to work on deploy */
/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve, h } from './deps.ts';
import {
  mappingMiddlewareHandler,
  useMappingMiddlewareHandler,
} from './middleware/mappingMiddleware.ts';
import {
  htmlMiddlewareHandler,
  useHtmlMiddlewareHandler,
} from './middleware/htmlMiddleware.tsx';

async function handler(_req: Request): Promise<Response> {
  if (useMappingMiddlewareHandler(_req.url)) {
    return await mappingMiddlewareHandler(_req);
  }

  if (useHtmlMiddlewareHandler(_req.url)) {
    return await htmlMiddlewareHandler(_req);
  }

  // return 404 for unsupported path segments
  return new Response(
    JSON.stringify({ message: `found no handler for path: ${_req.url}` }),
    {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      status: 404,
    },
  );
}

console.log('Server started on http://localhost:8000/');
await serve(handler);
