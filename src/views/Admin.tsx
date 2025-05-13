
import { useEffect, useState, Component } from "react"
import AccessDeniedSplash from '@/components/appconfig/AccessDeniedSplash'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import { useMainnetBridge } from '@/contexts/MainnetBridgeContext'
import LoadingSplash from '@/components/LoadingSplash'
import fetchQuery from '@/helpers_bridge/fetchQuery'
import { fromWei } from '@/helpers/wei'
import { getAddressLink } from '@/helpers/etherscan'
import Button from '@/components/appconfig/ui/Button'
import Paginator from '@/components/Paginator'
import InfoForm from '@/components/bridge/InfoForm/'
import { useConfirmationModal } from '@/components/ConfirmationModal'

import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow, 
  TableCell,
} from '@/components/appconfig/ui/Table'

import {
  MAINNET_CHAIN_ID,
  MAINNET_CONTRACT,
  TARGET_CHAIN_ID,
  TARGET_CHAIN_CONTRACT,
  TARGET_CHAIN_TOKEN
} from '@/config'

export default function Admin(props) {
  const {
    gotoPage,
    params: {
      page = 0,
    }
  } = props
  
  const {
    isConnected,
    injectedAccount
  } = useInjectedWeb3()

  const {
    openModal,
    closeModal
  } = useConfirmationModal()

  const {
    contractInfo,
    contractInfo: {
      queryLength,
      tokenSymbol,
      tokenDecimals
    },
    isFetching,
  } = useMainnetBridge()
  
  const perPage = 20
  const [ items, setItems ] = useState([])
  const [ isFetchingItems, setIsFetchingItems ] = useState(false)
  
  useEffect(() => {
    setIsFetchingItems(true)
    fetchQuery({
      chainId: MAINNET_CHAIN_ID,
      address: MAINNET_CONTRACT,
      targetChainId: TARGET_CHAIN_ID,
      targetAddress: TARGET_CHAIN_CONTRACT,
      offset: page * perPage,
      limit: perPage
    }).then(({ requests } ) => {
      setItems(requests)
    }).catch((err) => {
      console.log('>>> Fail', err)
    }).finally(() => {
      setIsFetchingItems(false)
    })
  }, [
    MAINNET_CHAIN_ID,
    MAINNET_CONTRACT,
    TARGET_CHAIN_ID,
    TARGET_CHAIN_CONTRACT,
    contractInfo,
    page
  ])
  
  const handleOpenInfo = (requestId) => {
    openModal({
      title: `Info about request #${requestId}`,
      hideBottomButtons: true,
      fullWidth: true,
      id: 'REQUEST_INFO',
      content: (
        <InfoForm
          requestId={requestId}
        />
      )
    })
  }
  
  if (isFetchingItems || isFetching) {
    return (
      <LoadingSplash />
    )
  }
  
  return (
    <>
      {!injectedAccount ? (
        <ConnectWalletButton />
      ) : (
        <>
          {contractInfo.owner.toLowerCase() == injectedAccount.toLowerCase() ? (
            <>
              <Table>
                <TableHead>
                  <TableHeadCell>{`#ID`}</TableHeadCell>
                  <TableHeadCell>{`Time`}</TableHeadCell>
                  <TableHeadCell>{`Spender`}</TableHeadCell>
                  <TableHeadCell>{`Amount ${tokenSymbol}`}</TableHeadCell>
                  <TableHeadCell>{`Status`}</TableHeadCell>
                  <TableHeadCell>{`Actions`}</TableHeadCell>
                </TableHead>
                <TableBody>
                  {items.length > 0 ? (
                    <>
                      {items.map((item) => {
                        const {
                          amount, from, id, inUtx, status
                        } = item
                        return (
                          <TableRow>
                            <TableCell>{id}</TableCell>
                            <TableCell>{inUtx}</TableCell>
                            <TableCell>
                              <a
                                target={`_blank`}
                                href={getAddressLink(MAINNET_CHAIN_ID, from)}
                                className="text-blue-500"
                              >
                                {from}
                              </a>
                            </TableCell>
                            <TableCell>{fromWei(amount, tokenDecimals)}</TableCell>
                            <TableCell>{status}</TableCell>
                            <TableCell>
                              <Button onClick={() => { handleOpenInfo(id) }}>{`Info`}</Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan="6" className="font-bold text-center">{`empty`}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {items.length > 0 && (
                <Paginator
                  page={page}
                  totalItems={queryLength}
                  perPage={perPage}
                  href={`#/admin/{page}`}
                />
              )}
            </>
          ) : (
            <AccessDeniedSplash adminAddress={contractInfo.owner} />
          )}
        </>
      )}
    </>
  )
}
