export const currency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const shortDate = (value) =>
  value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '';

export const isoDate = (value = new Date()) => new Date(value).toISOString().slice(0, 10);
