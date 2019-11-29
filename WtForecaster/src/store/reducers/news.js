import * as actionTypes from '../actions/actionTypes';

const initialState = {
  news: null,
  loadingNews: false
}

const reducer = ((state = initialState, action) => {
  switch(action.type) {
    case actionTypes.START_FETCHING_NEWS: 
      return {
        ...state,
        loadingNews: true
      }
    case actionTypes.FETCH_NEWS_SUCCEEDED: 
      return {
        ...state,
        loadingNews: false,
        news: action.news
      }
      case actionTypes.FETCH_NEWS_FAILED: 
      return {
        ...state,
        loadingNews: false
      }
    default:
      return state;
  }
});

export default reducer;

