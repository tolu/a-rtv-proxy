/** @jsx h */

import { h, jsx } from '../deps.ts';
import { PageList as IPageList } from '../types/ApiPages.ts';
import { Layout } from './Layout.tsx';

function PageListTemplate({ pageList }: { pageList: IPageList }) {
  return (
    <main>
      <h1>Pages</h1>
      <ul style='display: flex;'>
        {pageList.map((p) => (
          <a
            href={p.link.replace('/pages/', '/html/pages/')}
            style='padding: 1rem'
          >
            {p.name}
          </a>
        ))}
      </ul>
    </main>
  );
}

export const PageList = ({data}: {data: IPageList}) =>
  (<Layout><PageListTemplate pageList={data} /></Layout>);
