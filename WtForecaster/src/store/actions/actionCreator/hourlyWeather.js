import * as actionTypes from '../actionTypes';
import axios from '../../../utils/axiosConfig';

export const startFetchingHourlyWeather = () => {
  return {
    type: actionTypes.START_FETCHING_HOURLY_WEATHER
  }
}

export const fetchHourlyWeatherSucceeded = (hourlyWeather) => {
  return {
    type: actionTypes.FETCH_HOURLY_WEATHER_SUCCEEDED,
    hourlyWeather
  }
}

export const fetchHourlyWeatherFailed = () => {
  return {
    type: actionTypes.FETCH_HOURLY_WEATHER_FAILED
  }
}

export const fetchHourlyWeather = (coords) => {
  return dispatch => {
    dispatch(startFetchingHourlyWeather());
    axios.get(`/weatherCache/Hourly?longitude=${coords.longitude}&latitude=${coords.latitude}`)
    .then(result => {
      dispatch(fetchHourlyWeatherSucceeded(result.data.weatherInfor))
    })
    .catch(error => {
      dispatch(fetchHourlyWeatherFailed());
    })
  }
}

