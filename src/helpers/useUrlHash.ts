import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const useUrlHash = () => {
  const router = useRouter()
  const [hash, setHash] = useState(router.asPath.split('#')[1] || '')

  const updateHash = (str) => {
    if (!str) return
    setHash(str.split('#')[1])
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

  return hash
}
export default useUrlHash