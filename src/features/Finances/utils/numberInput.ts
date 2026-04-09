export function normalizeDecimalString(value: string): string {
  return value.replace(/,/g, ".");
}

export function parseLocaleDecimal(value: string): number {
  const normalized = normalizeDecimalString(value).trim();
  if (!normalized) return 0;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isValidDecimalInput(value: string): boolean {
  return /^$|^\d+(?:[.,]\d*)?$|^[.,]\d*$/.test(value);
}
