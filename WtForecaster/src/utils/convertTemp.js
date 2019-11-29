export const convertTemp = (temp ,unit) => {
  if (unit === 'us') {
    return Math.round((temp * 9/5) + 32);
  }
  return Math.round(temp);
}