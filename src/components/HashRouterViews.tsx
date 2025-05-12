import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import React from "react"

export default function HashRouterViews(props) {
  const {
    on404,
    views,
    props: ownProps,
    processHash,
  } = {
    processHash: (hash) => { return hash },
    ...props,
  }
  
  const router = useRouter()

  const _processHash = (inHash) => {
    if (!inHash) return '/'
    return processHash(inHash)
  }

  const [hash, setHash] = useState(_processHash(router.asPath.split('#')[1] || ''))

  const gotoPage = (url) => {
    window.location.hash = url
  }

  const updateHash = (str) => {
    if (!str) {
      setHash('/')
    } else {
      setHash(_processHash(str.split('#')[1] || ''))
    }
  }

  useEffect(() => {
    const onWindowHashChange = () => updateHash(window.location.hash)
    const onNextJSHashChange = (url) => updateHash(url)

    router.events.on('hashChangeStart', onNextJSHashChange)
    window.addEventListener('hashchange', onWindowHashChange)
    window.addEventListener('load', onWindowHashChange)
    return () => {
      router.events.off('hashChangeStart', onNextJSHashChange)
      window.removeEventListener('load', onWindowHashChange)
      window.removeEventListener('hashchange', onWindowHashChange)
    }
  }, [router.asPath, router.events])

  const detectView = (hash) => {
    if (!hash) hash = `/`
    let activeView = false
    Object.keys(views).forEach((path) => {
      const pathParts = []
      const pathParams = {}
      let pathParamsCount = 0
      path
        .split('/')
        .filter((part) => { return part != '' })
        .forEach((part, index) => {
          if (part.substr(0,1) == ":") {
            pathParams[index] = part
            pathParamsCount++
          } else {
            pathParts.push(part)
          }
        })
      const hashParts = []
      const hashParams = {}
      let hashParamsCount = 0
      hash
        .split('/')
        .filter((part) => { return part != '' })
        .forEach((part, index) => {
          if (pathParams[index] !== undefined) {
            hashParams[pathParams[index].substr(1)] = part
            hashParamsCount++
          } else {
            hashParts.push(part)
          }
        })

      if ((hashParamsCount == pathParamsCount)
        && hashParts.join('/').toLowerCase() == pathParts.join('/').toLowerCase()
      ) {
        activeView = {
          params: hashParams,
          path,
        }
      }
    })
    return activeView
  }
  
  const [ activeView, setActiveView ] = useState(detectView(hash))
  
  useEffect(() => {
    setActiveView(detectView(hash))
  }, [ hash ])

  const render404 = () => {
    return React.createElement(on404, {...props, ...ownProps, gotoPage })
  }


  if (activeView) {
    return React.createElement(views[activeView.path], {...props, ...ownProps, gotoPage, params: activeView.params, render404 })
  } else {
    if (on404) {
      return React.createElement(on404, {...props, ...ownProps, gotoPage })
    } else {
      return null
    }
  }
}