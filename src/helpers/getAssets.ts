export const getAssets = (url, assetKey) => {
  if (process.env.NODE_ENV == 'production') {
    return `/_NEXT_GEN_APP/assets/${url}`
  } else {
    return `/assets/${url}`
  }
}