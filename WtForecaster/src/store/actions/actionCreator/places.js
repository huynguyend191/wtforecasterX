import * as actionTypes from '../actionTypes';
import axios from '../../../utils/axiosConfig';

export const startGettingCurrentCity = () => {
  return {
    type: actionTypes.START_GETTING_CURRENT_CITY
  }
}

export const getCurrentCitySucceeded = (city) => {
  return {
    type: actionTypes.GET_CURRENT_CITY_SUCCEEDED,
    city
  }
}

export const getCurrentCityFailed = () => {
  return {
    type: actionTypes.GET_CURRENT_CITY_FAILED
  }
}

export const getCurrentCity = (coords) => {
  return dispatch => {
    dispatch(startGettingCurrentCity());
    axios.get(`/places/toAddress/${coords.longitude}/${coords.latitude}`)
    .then(result => {
      dispatch(getCurrentCitySucceeded(result.data.results[0]))
    })
    .catch(error => {
      dispatch(getCurrentCityFailed());
    })
  }
}

