export const appShell = (bodyHtml: string) => {
  return /*html*/`
  <html>
    <head>
      <style>
        html {
          font: normal 400 16px/1.5 system-ui, sans-serif;
          color: #e8e6e3;
          background-color: #181a1b;
        }
        body {
          margin: auto;
          max-width: 70ch;
          padding-block: 2rem;
        }
        a {
          color: #e8e6e3;
          transition: transform 400ms;
        }
        a:hover { transform: scale(1.35) }
      </style>
    </head>
    <body>
      ${bodyHtml}
    </body>
  </html>
  `;
}