/** @jsx h */

import { h, renderSSR } from '../deps.ts';
import { PageList } from '../types/ApiPages.ts';

function PageList({pageList}: {pageList: PageList}) {
  return (
    <main>
      <h1>Pages</h1>
      <ul style="display: flex;">
        { pageList.map(p => 
          <a href={p.link.replace('/pages/','/html/pages/')}
             style="padding: 1rem">{p.name}</a>
        )}
      </ul>
    </main>
  );
}

export const pageListRenderer = (pageList: PageList) => renderSSR(<PageList pageList={pageList} />);
