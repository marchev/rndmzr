import axios from 'axios'
import rateLimit from 'axios-rate-limit'

const httpClient = rateLimit(axios.create({
    baseURL: 'https://api.clockify.me/api/v1',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}), { maxRPS: 10 });

httpClient.interceptors.request.use(
    async config => {
      const apiKey = getAPIKey()
      if (apiKey) {
        config.headers['X-Api-Key'] = apiKey
      }
      return config;
    },
    error => {
      Promise.reject(error)
    }
);

function getAPIKey() {
  const vuexState = JSON.parse(localStorage.getItem('vuex'))
  if (vuexState !== null) {
    const { apiKey } = vuexState
    return apiKey
  }
  else {
    return undefined
  }
}
  
export default httpClient;