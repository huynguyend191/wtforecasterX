import axios from 'axios';

const baseURL = 'http://192.168.1.88:3000';

const axiosRequest = axios.create({
  baseURL: baseURL
});

export default axiosRequest;
