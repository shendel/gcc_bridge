import type { AppProps } from "next/app"
import Head from 'next/head'
import getConfig from 'next/config'


import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import HashRouterViews from '@/components/HashRouterViews'

import Home from '@/views/Home'
import Admin from '@/views/Admin'
import MarkDownViewer from '@/views/MarkDownViewer'


import Page404 from '@/pages/404'

import AppRootWrapper from '@/components/AppRootWrapper'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import NETWORKS from '@/contstans/NETWORKS'

import { TITLE } from '@/config'
function MyBridgeApp(pageProps) {
  const viewsPaths = {
    '/': Home,
    '/:subpage': Home,
    '/:subpage/:pageOrRequest': Home,
    '/admin': Admin,
    '/admin/:page': Admin,
    '/about': MarkDownViewer({
      title: `About - ${TITLE}`,
      url: './about.md'
    }),
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto p-10 mt-10 max-sm:p-4 max-sm:mt-0 max-sm:pt-10 flex-grow">
          <HashRouterViews
            views={{
              ...viewsPaths,
            }}
            props={{
            }}
            on404={Page404}
          />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default MyBridgeApp;
