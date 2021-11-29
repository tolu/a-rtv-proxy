/** @jsx h */
import { h } from '../deps.ts';

interface Props {
  start: Date | null;
  end: Date | null;
}
export function ProgressBar({ start, end }: Props) {
  if (!start || !end) return '';
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = end.getTime();
  if (now > endTime) return '';
  if (now < startTime) return '';
  const progress = Math.round(
    (now - startTime) / (endTime - startTime) * 100,
  );
  const style =
    `height: 5px; width: ${progress}%; background: rgba(255 255 0 / 75%);`;
  return (
    <div
      style={{
        borderRadius: '50vw',
        overflow: 'hidden',
        background: 'rgba(100 100 100 / 50%)',
        position: 'relative',
        bottom: '13px',
        width: '95%',
        margin: 'auto',
      }}
    >
      <div style={style}></div>
    </div>
  );
}
