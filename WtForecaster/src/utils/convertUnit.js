export const convertTemp = (temp ,unit) => {
  if (unit === 'F') {
    return Math.round((temp * 9/5) + 32);
  }
  return Math.round(temp);
}

export const convertWindSpeed = (speed, unit) => {
  if (unit === 'm/s') {
    return (speed * 1609.344 / 3600).toFixed(1);
  }
  return Math.round(speed);
}

export const convertTimeFormat = (time , format) => {
  if (format === '12h') {
    let hour = new Date(time).getHours();
    let AmOrPm = hour >= 12 ? 'PM' : 'AM';
    hour = (hour % 12) || 12;
    return hour + ':00 ' + AmOrPm;
  }
  return new Date(time).getHours() + ':00';
} 