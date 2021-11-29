/** @jsx h */

import { h } from '../deps.ts';
import { Page } from '../types/ApiPages.ts';
import type { MappedAsset } from '../types/MappedAsset.ts';
import { ProgressBar } from './ProgressBar.tsx';

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
