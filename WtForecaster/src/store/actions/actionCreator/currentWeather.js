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

export const changeUnit = (unit) => {
  return {
    type: actionTypes.CHANGE_UNIT,
    unit
  }
}
