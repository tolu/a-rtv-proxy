/** @jsx h */

import { h } from '../deps.ts';
import { Page } from '../types/ApiPages.ts';
import type { MappedAsset } from '../types/MappedAsset.ts';
import { ProgressBar } from './ProgressBar.tsx';

export function Swimlane(
  { s }: { s: Page['swimlanes'][0] & { items: any[] } },
) {
  return (
    <div>
      <h2>{s.name} ({s.type} : {s.style})</h2>
      <div style='overflow-x: auto; display: flex' class='swimlane'>
        {s.items.map((i) => <SwimlaneItem item={i} />)}
      </div>
    </div>
  );
}

function SwimlaneItem({ item }: { item: MappedAsset }) {
  const startTime = item.startTimeEpoch ? new Date(item.startTimeEpoch) : null;
  const endTime = item.startTimeEpoch && item.durationInSeconds
    ? new Date(item.startTimeEpoch + item.durationInSeconds * 1000)
    : null;
  return (
    <div style='margin-right: 1rem; position: relative'>
      <div style='position:relative' class='image-wrapper'>
        <AssetImg src={item.image[0].url} />
        <LogoImg src={item.providerLogoUrl} />
        <ProgressBar start={startTime} end={endTime} />
      </div>
      <h3>{item.title}</h3>
      <p class='hover'>{item.subtitle}</p>
    </div>
  );
}

function AssetImg({ src }: { src: string }) {
  return (
    <picture>
      <img width={300} height={9 / 16 * 300} loading='lazy' src={src} />
    </picture>
  );
}

function LogoImg({ src }: { src: string }) {
  return (
    <img
      src={src}
      width='40'
      style='border-radius: 50vw; position: absolute; right: 10px; top: 10px;'
    />
  );
}
