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
  const assetLists = await Promise.all(
    supportedLanes.map(async (list) => {
      const items = await (await fetch(list.link)).json();
      return { ...list, items };
    }),
  );
  console.log('render page', 3);

  return renderSSR(<Page title={title} assetLists={assetLists} />);
};
