
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useMarkDown } from '@/contexts/MarkDownContext'

import ConnectWalletButton from '@/components/ConnectWalletButton'
import Tabs from '@/components/appconfig/ui/Tabs'

import Form from '@/components/bridge/Form/'
import RequestInfo from '@/components/bridge/RequestInfo'
import UserHistory from '@/components/bridge/UserHistory'
import MarkDownBlock from '@/components/MarkDownBlock'
import LoadingPlaceholder from '@/components/LoadingPlaceholder'


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
  
  const { getFile } = useMarkDown()

  const [ topBlockLoading, setTopBlockLoading ] = useState(true)
  const [ topBlockContent, setTopBlockContent ] = useState(false)

  const [ bottomBlockLoading, setBottomBlockLoading ] = useState(true)
  const [ bottomBlockContent, setBottomBlockContent ] = useState(false)
  
  useEffect(() => {
    getFile('./topBlock.md').then((content) => {
      setTopBlockContent(content)
    }).catch((err) => {}).finally(() => { setTopBlockLoading(false) })
    getFile('./bottomBlock.md').then((content) => {
      setBottomBlockContent(content)
    }).catch((err) => {}).finally(() => { setBottomBlockLoading(false) })
  }, [])

  const {
    isConnected,
    injectedAccount
  } = useInjectedWeb3()


  return (
    <>
      {(topBlockLoading || topBlockContent !== false) && (
        <div className="w-full pt-8">
          {topBlockLoading ? (
            <div className="w-full mx-auto lg:max-w-6xl" style={{paddingBottom: '1px'}}>
              <LoadingPlaceholder height={`64px`} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto lg:max-w-6xl markdown-container" style={{paddingBottom: '1px'}}>
              <MarkDownBlock markdown={topBlockContent} />
            </div>
          )}
        </div>
      )}
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
      {(bottomBlockLoading || bottomBlockContent !== false) && (
        <div className="w-full pt-2">
          {bottomBlockLoading ? (
            <div className="w-full mx-auto lg:max-w-6xl" style={{paddingBottom: '1px'}}>
              <LoadingPlaceholder height={`64px`} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto lg:max-w-6xl markdown-container" style={{paddingBottom: '1px'}}>
              <MarkDownBlock markdown={bottomBlockContent} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
