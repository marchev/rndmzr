import axios from 'axios'

const httpClient = axios.create({
    baseURL: 'https://api.clockify.me/api/v1',
    timeout: 5000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

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