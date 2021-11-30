/** @jsx h */

import { h, renderSSR } from '../deps.ts';
import { Page } from '../types/ApiPages.ts';
import { Swimlane } from './Swimlane.tsx';

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
  console.log('render page', 1);
  const supportedLanes = swimlanes.filter((s) => s.type !== 'Menu').slice(
    1,
    5,
  );
  console.log('render page', 2, {supportedLanes});

  const assetLists: Array<Page['swimlanes'][0] & {items: any[]}> = [];
  for (let lane of supportedLanes) {
    try {
      let res = await fetch(lane.link);
      console.log(lane.link, {res});
      let items = await res.json();
      assetLists.push({ ...lane, items });
    } catch (err) {
      console.log('failed', {err});
    }
  }
  console.log('render page', 3);

  return renderSSR(<Page title={title} assetLists={assetLists} />);
};
