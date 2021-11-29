import { serve } from './deps.ts';
import { renderApp } from './testComponent.tsx';

function handler(req: Request) {
  const html = renderApp();
  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
}

console.log("Listening on http://localhost:8000");
serve(handler);