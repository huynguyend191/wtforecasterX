import {convertTemp} from './convertTemp';

export const getHourlyData = (weatherInfo, unit) => {
  return [
    { x: 1, y: convertTemp(weatherInfo[0].temp, unit) },
    { x: 2, y: convertTemp(weatherInfo[1].temp, unit) },
    { x: 3, y: convertTemp(weatherInfo[2].temp, unit) },
    { x: 4, y: convertTemp(weatherInfo[3].temp, unit) },
    { x: 5, y: convertTemp(weatherInfo[4].temp, unit) },
    { x: 6, y: convertTemp(weatherInfo[5].temp, unit) },
    { x: 7, y: convertTemp(weatherInfo[6].temp, unit) },
    { x: 8, y: convertTemp(weatherInfo[7].temp, unit) },
  ];
}

export const getHourlyLabel = (weatherInfo) => {
  return { x: [
    new Date(weatherInfo[0].time).getHours() + ':00', 
    new Date(weatherInfo[1].time).getHours() + ':00', 
    new Date(weatherInfo[2].time).getHours() + ':00', 
    new Date(weatherInfo[3].time).getHours() + ':00', 
    new Date(weatherInfo[4].time).getHours() + ':00', 
    new Date(weatherInfo[5].time).getHours() + ':00', 
    new Date(weatherInfo[6].time).getHours() + ':00', 
    new Date(weatherInfo[7].time).getHours() + ':00', 
  ] };
}

export const getDailyDataMax = (weatherInfo, unit) => {
  return [
    { x: 1, y: convertTemp(weatherInfo[0].temperatureMax, unit) },
    { x: 2, y: convertTemp(weatherInfo[1].temperatureMax, unit) },
    { x: 3, y: convertTemp(weatherInfo[2].temperatureMax, unit) },
    { x: 4, y: convertTemp(weatherInfo[3].temperatureMax, unit) },
    { x: 5, y: convertTemp(weatherInfo[4].temperatureMax, unit) },
    { x: 6, y: convertTemp(weatherInfo[5].temperatureMax, unit) },
    { x: 7, y: convertTemp(weatherInfo[6].temperatureMax, unit) },
    { x: 8, y: convertTemp(weatherInfo[7].temperatureMax, unit) },
  ];
}

export const getDailyDataMin = (weatherInfo, unit) => {
  return [
    { x: 1, y: convertTemp(weatherInfo[0].temperatureMin, unit) },
    { x: 2, y: convertTemp(weatherInfo[1].temperatureMin, unit) },
    { x: 3, y: convertTemp(weatherInfo[2].temperatureMin, unit) },
    { x: 4, y: convertTemp(weatherInfo[3].temperatureMin, unit) },
    { x: 5, y: convertTemp(weatherInfo[4].temperatureMin, unit) },
    { x: 6, y: convertTemp(weatherInfo[5].temperatureMin, unit) },
    { x: 7, y: convertTemp(weatherInfo[6].temperatureMin, unit) },
    { x: 8, y: convertTemp(weatherInfo[7].temperatureMin, unit) },
  ];
}

export const getDailyLabel = (weatherInfo) => {
  return { x: [
    new Date(weatherInfo[0].date).getDate() + '/' + new Date(weatherInfo[0].date).getMonth(), 
    new Date(weatherInfo[1].date).getDate() + '/' + new Date(weatherInfo[1].date).getMonth(), 
    new Date(weatherInfo[2].date).getDate() + '/' + new Date(weatherInfo[2].date).getMonth(), 
    new Date(weatherInfo[3].date).getDate() + '/' + new Date(weatherInfo[3].date).getMonth(), 
    new Date(weatherInfo[4].date).getDate() + '/' + new Date(weatherInfo[4].date).getMonth(), 
    new Date(weatherInfo[5].date).getDate() + '/' + new Date(weatherInfo[5].date).getMonth(), 
    new Date(weatherInfo[6].date).getDate() + '/' + new Date(weatherInfo[6].date).getMonth(), 
    new Date(weatherInfo[7].date).getDate() + '/' + new Date(weatherInfo[7].date).getMonth(), 
  ]};
}