export const appShell = (bodyHtml: string) => {
  return /*html*/`
  <html>
    <head>
      <style>
        :root {
          --body-width: 80ch;
        }
        html {
          font: normal 400 16px/1.5 system-ui, sans-serif;
          color: #e8e6e3;
          background-color: #181a1b;
        }
        body {
          margin: auto;
          max-width: var(--body-width);
          padding-block: 2rem;
        }
        a {
          color: #e8e6e3;
          transition: transform 400ms;
        }
        a:hover { transform: scale(1.35) }
        h2 { margin-bottom: 0 }
        .swimlane {
          padding-top: 1rem;
          margin-left: calc(-97vw / 2 + var(--body-width) / 2);
          margin-right: calc(-97vw / 2 + var(--body-width) / 2);
        }
        .swimlane h3 {
          margin: .35rem 0 .25rem;
          font-size: 1rem;
        }
        .swimlane p {
          color: #999;
          font-size: .875rem;
          margin-block: 0;
        }
        .hover { opacity: 0; transition: opacity 300ms; }
        .swimlane > div:hover .hover { opacity: 1 }
        .swimlane [loading=lazy] { transition: transform 300ms; transform: scale(1); border-radius: 5px; }
        .swimlane > div:hover [loading=lazy] { transform: scale(1.05) }
      </style>
    </head>
    <body>
      ${bodyHtml}
    </body>
  </html>
  `;
}