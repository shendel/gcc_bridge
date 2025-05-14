
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import Tabs from '@/components/appconfig/ui/Tabs'

import Form from '@/components/bridge/Form/'
import RequestInfo from '@/components/bridge/RequestInfo'


export default function Home(props) {
  const {
    gotoPage,
    params,
    params: {
      subpage,
      requestId
    },
    on404
  } = props
  
  if (subpage && (['history', 'request'].indexOf(subpage) == -1)) {
    return on404()
  }
  if (subpage == 'history' && requestId !== undefined) {
    return on404()
  }
  if (subpage == 'request' && (requestId == undefined || isNaN(requestId))) {
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
                <div>
                  History page
                </div>
              )}
              {subpage == 'request' && requestId && (
                <RequestInfo requestId={requestId} on404={on404} />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
