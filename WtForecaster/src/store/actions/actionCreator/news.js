import * as actionTypes from '../actionTypes';
import axios from '../../../utils/axiosConfig';

export const startFetchingNews = () => {
  return {
    type: actionTypes.START_FETCHING_NEWS
  }
}

export const fetchNewsSucceeded = (news) => {
  return {
    type: actionTypes.FETCH_NEWS_SUCCEEDED,
    news
  }
}

export const fetchNewsFailed = () => {
  return {
    type: actionTypes.FETCH_NEWS_FAILED
  }
}

export const fetchNews = () => {
  return dispatch => {
    dispatch(startFetchingNews());
    axios.get(`/news/forecast?page=1`)
    .then(result => {
      dispatch(fetchNewsSucceeded(result.data.data[0].data))
    })
    .catch(error => {
      dispatch(fetchNewsFailed());
    })
  }
}

