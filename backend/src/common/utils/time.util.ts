import dayjs from 'dayjs';

type TTimeUnit = 'day' | 'hour' | 'minute' | 'second';

const unitMap: Record<string, TTimeUnit> = {
  d: 'day',
  h: 'hour',
  m: 'minute',
  s: 'second',
};

export function parseExpiresIn(expiresIn: string): {
  value: number;
  unit: TTimeUnit;
} {
  const value = parseInt(expiresIn, 10);
  const unitKey = expiresIn.replace(value.toString(), '');

  const unit = unitMap[unitKey];

  if (!unit) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  return { value, unit };
}

export function getExpirationDate(expiresIn: string): Date {
  const { value, unit } = parseExpiresIn(expiresIn);
  return dayjs().add(value, unit).toDate();
}