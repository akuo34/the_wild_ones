import Axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

let urls = {
  development: 'http://localhost:3000',
  production: 'http://thewildonesart.com'
}

const api = Axios.create({
  baseURL: urls[publicRuntimeConfig.nodeEnv],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;