const cachedMedia = {}

export const mediaCacheAdd = (url, data) => {
  cachedMedia[url] = data
}

export const mediaCacheGet = (url) => {
  return cachedMedia[url] || false
}
