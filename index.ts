import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { useMappingMiddlewareHandler, mappingMiddlewareHandler } from './middleware/mappingMiddleware.ts';
import { useHtmlMiddlewareHandler, htmlMiddlewareHandler } from './middleware/htmlMiddleware.tsx';

async function handler(_req: Request): Promise<Response> {
  if (useMappingMiddlewareHandler(_req.url)) {
    return await mappingMiddlewareHandler(_req);
  }

  if (useHtmlMiddlewareHandler(_req.url)) {
    return await htmlMiddlewareHandler(_req);
  }

  // return 404 for unsupported path segments
  return new Response(JSON.stringify({ message: `found no handler for path: ${_req.url}` }), {
    headers: { "content-type": "application/json; charset=utf-8" },
    status: 404
  });
}

console.log("Server started on http://localhost:8000/");
await serve(handler);
