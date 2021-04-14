import axios from 'axios'
import rateLimit from 'axios-rate-limit'
import * as rax from 'retry-axios'

rax.attach()

const httpClient = rateLimit(axios.create({
    baseURL: 'https://api.clockify.me/api/v1',
    timeout: 60000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    raxConfig: {
      retry: 3,
      backoffType: 'exponential',
      httpMethodsToRetry: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
}), { maxRPS: 8 }); // Clockify accepts 10 RPS, 8 should be a safe bet

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
    console.error('Clockify API key has not been configured.')
    return undefined
  }
}
  
export default httpClient;