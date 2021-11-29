/** @jsx h */

import { Page } from '../types/ApiPages.ts';
import type { MappedAsset } from '../types/MappedAsset.ts';
import { h } from '../deps.ts';

export function Swimlane({s}: {s: Page['swimlanes'][0] & {items: any[]}}) {
  return (
    <div>
      <h2>{s.name} ({s.type} : {s.style})</h2>
      <div style="overflow-x: auto; display: flex" class="swimlane">
      { s.items.map(i  => (<Item item={i} />)) }
      </div>
    </div>
  );
}

function Item({item}: {item: MappedAsset}) {
  const startTime = item.startTimeEpoch ? new Date(item.startTimeEpoch) : null;
  const endTime = item.startTimeEpoch && item.durationInSeconds ? new Date(item.startTimeEpoch + item.durationInSeconds * 1000) : null;
  return (
    <div style="margin-right: 1rem; position: relative">
    <div style="position:relative" class="image-wrapper">
      <picture>
        <img width="300" loading="lazy" src={item.image[0].url} />
      </picture>
      <img src={item.providerLogoUrl} width="40" style="border-radius: 50vw; position: absolute; right: 10px; top: 10px;" />
      <ProgressBar start={startTime} end={endTime} />
    </div>
    <h3>{item.title}</h3>
    <p class="hover">{item.subtitle}</p>
  </div>
  );
}

function ProgressBar({start, end}: {start: Date | null, end: Date | null}) {
  if (!start || !end) return '';
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = end.getTime();
  if (now > endTime) return '';
  if (now < startTime) return '';
  const progress = Math.round((now - startTime) / (endTime - startTime) * 100);
  const style = `height: 5px; width: ${progress}%; background: rgba(255 255 0 / 75%);`;
  return (
    <div style="border-radius: 50vw; overflow: hidden; background: rgba(100 100 100 / 50%); position: relative; bottom: 13px; width: 95%; margin: auto;">
      <div style={style}></div>
    </div>
  );
}
