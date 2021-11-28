
export const useHtmlMiddlewareHandler = (_req: Request) => {
  const { pathname } = new URL(_req.url);
  const firstPathSegment = pathname.split('/').filter(Boolean)[0];
  return firstPathSegment === 'html';
}

export const htmlMiddlewareHandler = async (_req: Request) => {
  const html = `
    <div>
      <h1>Current time</h1>
      <p>${new Date().toLocaleString()}</p>
    </div>
  `;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });

}