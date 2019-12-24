import * as actionTypes from '../actionTypes';
import axios from '../../../utils/axiosConfig';

export const startFetchingCurrentWeather = () => {
  return {
    type: actionTypes.START_FETCHING_CURRENT_WEATHER
  }
}

export const fetchCurrentWeatherSucceeded = (currentWeather) => {
  return {
    type: actionTypes.FETCH_CURRENT_WEATHER_SUCCEEDED,
    currentWeather
  }
}

export const fetchCurrentWeatherFailed = () => {
  return {
    type: actionTypes.FETCH_CURRENT_WEATHER_FAILED
  }
}

export const fetchCurrentWeather = (coords) => {
  return dispatch => {
    dispatch(startFetchingCurrentWeather());
    axios.get(`/weather/Current?longitude=${coords.longitude}&latitude=${coords.latitude}`)
    .then(result => {
      dispatch(fetchCurrentWeatherSucceeded(result.data.weatherInfor))
    })
    .catch(error => {
      dispatch(fetchCurrentWeatherFailed());
    })
  }
}

export const changeTempUnit = (unit) => {
  return {
    type: actionTypes.CHANGE_TEMP_UNIT,
    unit
  }
}

export const changeSpeedUnit = (unit) => {
  return {
    type: actionTypes.CHANGE_SPEED_UNIT,
    unit
  }
}
export const changeTheme = (theme) => {
  return {
    type: actionTypes.CHANGE_THEME,
    theme
  }
}
export const initConfig = (config) => {
  return {
    type: actionTypes.INIT_CONFIG,
    config
  }
}