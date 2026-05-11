export const getDateLabel = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const isSameDay = (isoA, isoB) => isoA?.slice(0, 10) === isoB?.slice(0, 10);

export const daysAgoIso = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};