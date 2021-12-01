/** @jsx h */

import { h } from '../deps.ts';
import { Page as IPage } from '../types/ApiPages.ts';
import { Layout } from './Layout.tsx';
import { Swimlane } from './Swimlane.tsx';
import { fetchViaMiddleware } from '../middleware/mappingMiddleware.ts';

function PageTemplate({ title, assetLists }: { title: string; assetLists: any[] }) {
  return (
    <main>
      <h1>Page: {title}</h1>
      <div style='display: flex; flex-direction: column'>
        {assetLists.map((s) => <Swimlane s={s} />)}
      </div>
    </main>
  );
}

export const Page = async ({ swimlanes, title }: IPage) => {
  const supportedLanes = swimlanes.filter((s) => s.type !== 'Menu').slice(
    1,
    5,
  );

  const assetLists: Array<IPage['swimlanes'][0] & { items: any[] }> = [];
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

  return (<Layout><PageTemplate title={title} assetLists={assetLists} /></Layout>);
};
