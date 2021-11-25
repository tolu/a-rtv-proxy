import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

function handler(_req: Request): Response {
  const {
    body,
    headers,
    method,
    url,
  } = _req;
  const res = JSON.stringify({body,headers,method,url});
  return new Response(res, {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

console.log("Listening on http://localhost:8000");
await serve(handler);