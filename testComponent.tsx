/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { h, renderSSR } from './deps.ts';

function App() {
  return (
    <html>
      <body>
        <h1>Hello world 2!</h1>
      </body>
    </html>
  );
}

export function renderApp() {
  return renderSSR(<App />);
}