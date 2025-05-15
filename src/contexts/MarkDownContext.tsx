import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const MarkDownContext = createContext({
  getFile: (url) => {},
  getFiles: (keys) => {}
})

export const useMarkDown = () => {
  return useContext(MarkDownContext)
}


export default function MarkDownProvider({ children }) {

  const [ filesContents, setFilesContents ] = useState({})

  const getFile = (url) => {
    return new Promise((resolve, reject) => {
      if (filesContents[url]) {
        resolve(filesContents[url])
      } else {
        const fetchContent = async () => {
          try {
            const response = await axios.get(url);
            setFilesContents({
              ...filesContents,
              [`${url}`]: response.data
            })
            resolve(response.data)
          } catch (error) {
            reject(error)
          }
        }

        fetchContent()
      }
    })
  }
  
  const getFiles = (keys) => {}
  
  
  return (
    <MarkDownContext.Provider
      value={{
        getFile,
        getFiles
      }}
    >
      {children}
    </MarkDownContext.Provider>
  )
}