
export const offsetInHoursFromNow = (date: Date) => {
  const offsetHours = (date.getTime() - Date.now()) / 3_600_000;
  return offsetHours;
}

export const getTimeType = (broadcastDate: Date, durationInSeconds: number) => {
  const epochStart = broadcastDate.getTime();
  const epochEnd = epochStart + durationInSeconds * 1000;
  const now = Date.now();
  if (now > epochEnd) return 'past';
  if (epochStart > now) return 'future';
  return 'present';
}

export const inRange = (value: number, min: number, max: number) => value >= min && value <= max;
