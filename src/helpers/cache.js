const writeToCache = (key, data) => localStorage.setItem(key, JSON.stringify(data))

const readFromCache = key => JSON.parse(localStorage.getItem(key)) || null

export { readFromCache, writeToCache }