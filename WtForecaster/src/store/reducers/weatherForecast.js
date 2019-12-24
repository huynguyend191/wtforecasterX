import * as actionTypes from '../actions/actionTypes';

const initialState = {
  dailyWeather: null,
  loadingDailyWeather: false,
  currentWeather: null,
  loadingCurrentWeather: false,
  hourlyWeather: null,
  loadingHourlyWeather: false,
  timeUnit: 'C',
  speedUnit: 'mph',
  timeFormat: '24h',
  theme: 'light'
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
    case actionTypes.CHANGE_TEMP_UNIT:
      return {
        ...state,
        tempUnit: action.unit
      }
    case actionTypes.CHANGE_SPEED_UNIT: 
      return {
        ...state,
        speedUnit: action.unit
      }
    case actionTypes.INIT_CONFIG:
      return {
        ...state,
        speedUnit: action.config.speedUnit,
        tempUnit: action.config.tempUnit,
        timeFormat: action.config.timeFormat,
        theme: action.config.theme
      }
    case actionTypes.CHANGE_TIME_FORMAT:
      return {
        ...state,
        timeFormat: action.format
      }
    case actionTypes.CHANGE_THEME: 
      return {
        ...state,
        theme: action.theme
      }
    default:
      return state;
  }
});

export default reducer;

