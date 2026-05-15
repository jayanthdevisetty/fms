export const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const monthRange = (year, month) => ({
  start: new Date(Number(year), Number(month) - 1, 1),
  end: new Date(Number(year), Number(month), 0, 23, 59, 59, 999)
});

export const yearRange = (year) => ({
  start: new Date(Number(year), 0, 1),
  end: new Date(Number(year), 11, 31, 23, 59, 59, 999)
});
