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

const createRes = (msg: any, status = 200) => {
  const stringMessage = typeof msg === 'string';
  return new Response(stringMessage ? msg : JSON.stringify(stringMessage), {
    status,
    headers: !stringMessage ? { 'content-type': 'application/json; charset=utf-8' } : {}
  });
}