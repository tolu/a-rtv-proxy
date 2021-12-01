import { serve, json } from './deps.ts';
import { mappingMiddlewareHandler } from './middleware/mappingMiddleware.ts';
import { htmlMiddlewareHandler } from './middleware/htmlMiddleware.tsx';

await serve({
  // map api responses
  '/pages': async (req) => await mappingMiddlewareHandler(req),
  '/pages/*': async (req) => await mappingMiddlewareHandler(req),
  '/assets/*': async (req) => await mappingMiddlewareHandler(req),
  '/ontvnow/*': async (req) => await mappingMiddlewareHandler(req),
  // simple ssr html renderer
  '/html/*': async (req) => await htmlMiddlewareHandler(req),
  404: ({url}) => json({ message: `found no handler for path: ${url}` }, { status: 404 }),
});
