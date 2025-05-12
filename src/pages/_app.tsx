import type { AppProps } from "next/app"
import { useEffect, useState } from "react"

import '@/styles/globals.css'



function MyApp({ Component, pageProps }: AppProps) {
  const [isServer, setIsServer] = useState(true)

  useEffect(() => {
    setIsServer(false)
  }, [])
  if (isServer) return null

  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : <Component {...pageProps} />}
    </div>
  )
}

export default MyApp;
