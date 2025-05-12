import { useRouter } from "next/router"
import { useEffect, useState, createContext, useContext } from "react"
import React from "react"

const HashRouterContext = createContext({
  render404: () => {},
  setRender404: () => {},
  setGotoPage: () => {},
  gotoPage: () => {},
  params: [],
  path: '/'
})

export const useHashRouterContext = () => {
  return useContext(HashRouterContext)
}

export default function HashRouterProvider(props) {
  const {
    children
  } = props

  const [ params, setParams ] = useState([])
  const [ path, setPath ] = useState('/')
  const [ render404, setRender404 ] = useState(() => {})
  const [ gotoPage, setGotoPage ] = useState(() => {})
  
  return <HashRouterContext.Provider
    value={{
      render404,
      setRender404,
      gotoPage,
      setGotoPage,
      params,
      setParams,
      path,
      setPath
    }}
  >
    {children}
  </HashRouterContext.Provider>
}