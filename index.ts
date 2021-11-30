/* must be included in some file for tsx to work on deploy */
/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from './deps.ts';
import {
  mappingMiddlewareHandler,
  useMappingMiddlewareHandler,
} from './middleware/mappingMiddleware.ts';
import {
  htmlMiddlewareHandler,
  useHtmlMiddlewareHandler,
} from './middleware/htmlMiddleware.tsx';

const createRes = (msg: any, status = 200) => {
  const stringMessage = typeof msg === 'string';
  const body = stringMessage ? msg : JSON.stringify(msg, null, 2);
  return new Response(
    body,
    {
      status,
      headers: !stringMessage ? { 'content-type': 'application/json; charset=utf-8' } : undefined,
    }
  );
}

async function handler(_req: Request): Promise<Response> {
  if (useMappingMiddlewareHandler(_req.url)) {
    return await mappingMiddlewareHandler(_req);
  }

  if (useHtmlMiddlewareHandler(_req.url)) {
    try {
      return await htmlMiddlewareHandler(_req);
    } catch (err) {
      return createRes(err, 500);
    }
  }

  // return 404 for unsupported path segments
  return createRes({ message: `found no handler for path: ${_req.url}` }, 404);
}

console.log('Server started on http://localhost:8000/');
await serve(handler);