export const getLink = (url, hash=false) => {
  let _url = (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') ? `/_MYAPP/${url}` : `./${url}.html`
  if (url == `index`) {
    _url = ((process.env.NODE_ENV && process.env.NODE_ENV !== 'production') ? `/_MYAPP/` : `./index.html`)
  }
  return (hash) ? `${_url}#${hash}` : _url
}