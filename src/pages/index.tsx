import type { AppProps } from "next/app"
import Head from 'next/head'
import getConfig from 'next/config'


import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import AppRootWrapper from '@/components/AppRootWrapper'
import MyBridgeApp from '@/views/'

function MyApp(pageProps) {

  
  return (
    <>
      <AppRootWrapper>
        <MyBridgeApp />
      </AppRootWrapper>
    </>
  )
}

export default MyApp;
