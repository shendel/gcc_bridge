
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import Tabs from '@/components/appconfig/ui/Tabs'

import Form from '@/components/bridge/Form/'
import RequestInfo from '@/components/bridge/RequestInfo'
import UserHistory from '@/components/bridge/UserHistory'

export default function Home(props) {
  const {
    gotoPage,
    params,
    params: {
      subpage,
      pageOrRequest,
    },
    on404
  } = props
  
  if (subpage && (['history', 'request'].indexOf(subpage) == -1)) {
    return on404()
  }
  if (subpage == 'request' && (pageOrRequest == undefined || isNaN(pageOrRequest))) {
    return on404()
  }
  
  const {
    isConnected,
    injectedAccount
  } = useInjectedWeb3()


  return (
    <>
      {!injectedAccount ? (
        <ConnectWalletButton />
      ) : (
        <>
          {!subpage ? (
            <Form />
          ) : (
            <>
              {subpage == 'history' && (
                <UserHistory page={pageOrRequest}/>
              )}
              {subpage == 'request' && pageOrRequest && (
                <RequestInfo requestId={pageOrRequest} on404={on404} />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
