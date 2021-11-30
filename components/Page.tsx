/** @jsx h */

import { h, renderSSR } from '../deps.ts';
import { Page } from '../types/ApiPages.ts';
import { Swimlane } from './Swimlane.tsx';
import { fetchViaMiddleware } from '../middleware/mappingMiddleware.ts';

function Page({ title, assetLists }: { title: string; assetLists: any[] }) {
  return (
    <main>
      <h1>Page: {title}</h1>
      <div style='display: flex; flex-direction: column'>
        {assetLists.map((s) => <Swimlane s={s} />)}
      </div>
    </main>
  );
}

export const pageRenderer = async ({ title, swimlanes }: Page) => {
  const supportedLanes = swimlanes.filter((s) => s.type !== 'Menu').slice(
    1,
    5,
  );

  const assetLists: Array<Page['swimlanes'][0] & { items: any[] }> = [];
  for (let lane of supportedLanes) {
    try {
      // must go via mappingMiddleware since deno deploy does not allow requests to self
      let res = await fetchViaMiddleware(lane.link);
      let items = await res.json();
      assetLists.push({ ...lane, items });
    } catch (err) {
      console.log('swimlane fetch failed', { err });
    }
  }

  return renderSSR(<Page title={title} assetLists={assetLists} />);
};
