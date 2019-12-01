import axios from 'axios';

const baseURL = 'http://192.168.0.103:3000';

const axiosRequest = axios.create({
  baseURL: baseURL
});

export default axiosRequest;