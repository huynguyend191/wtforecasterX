import * as actionTypes from '../actions/actionTypes';

const initialState = {
  dailyWeather: null,
  loadingDailyWeather: false,
  currentWeather: null,
  loadingCurrentWeather: false,
  hourlyWeather: null,
  loadingHourlyWeather: false,
  unit: 'si'
}

const reducer = ((state = initialState, action) => {
  switch(action.type) {
    case actionTypes.START_FETCHING_DAILY_WEATHER:
      return {
        ...state,
        loadingDailyWeather: true
      };
    case actionTypes.FETCH_DAILY_WEATHER_SUCCEEDED:
      return {
        ...state,
        loadingDailyWeather: false,
        dailyWeather: action.dailyWeather
      };
    case actionTypes.FETCH_DAILY_WEATHER_FAILED:
      return {
        ...state,
        loadingDailyWeather: false
      };

    case actionTypes.START_FETCHING_CURRENT_WEATHER:
      return {
        ...state,
        loadingCurrentWeather: true
      };
    case actionTypes.FETCH_CURRENT_WEATHER_SUCCEEDED:
      return {
        ...state,
        loadingCurrentWeather: false,
        currentWeather: action.currentWeather
      };
    case actionTypes.FETCH_CURRENT_WEATHER_FAILED:
      return {
        ...state,
        loadingCurrentWeather: false
      };

      case actionTypes.START_FETCHING_HOURLY_WEATHER:
      return {
        ...state,
        loadingHourlyWeather: true
      };
    case actionTypes.FETCH_HOURLY_WEATHER_SUCCEEDED:
      return {
        ...state,
        loadingHourlyWeather: false,
        hourlyWeather: action.hourlyWeather
      };
    case actionTypes.FETCH_HOURLY_WEATHER_FAILED:
      return {
        ...state,
        loadingHourlyWeather: false
      };
    case actionTypes.CHANGE_UNIT:
      return {
        ...state,
        unit: action.unit
      }
    
    default:
      return state;
  }
});

export default reducer;

