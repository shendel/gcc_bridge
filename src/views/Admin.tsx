
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
import formatUnixTimestamp from '@/helpers/formatUnixTimestamp'
import LoadingIndicator from '@/components/LoadingIndicator'

import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow, 
  TableCell,
} from '@/components/appconfig/ui/Table'

import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS,
  REJECT_ACTIONS_LABELS,
  REJECT_ACTIONS
} from '@/helpers_bridge/constants'

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
      tokenDecimals,
      refundTimeout
    },
    isFetching,
  } = useMainnetBridge()
  
  const perPage = 10
  const [ items, setItems ] = useState([])
  const [ isFetchingItems, setIsFetchingItems ] = useState(false)
  const [ sourceTimestamp, setSourceTimestamp ] = useState(0)
  const [ needUpdate, setNeedUpdate ] = useState(false)
  const [ isUpdating, setIsUpdating ] = useState(false)

  const _fetchItems = () => {
    return new Promise((resolve, reject) => {
      fetchQuery({
        chainId: MAINNET_CHAIN_ID,
        address: MAINNET_CONTRACT,
        targetChainId: TARGET_CHAIN_ID,
        targetChainAddress: TARGET_CHAIN_CONTRACT,
        offset: page * perPage,
        limit: perPage
      }).then(( answer ) => {
        console.log('>> FETCHED')
        const { requests, sourceTimestamp } = answer
        setSourceTimestamp(Number(sourceTimestamp))
        setItems(requests)
        resolve()
      }).catch((err) => {
        console.log('>>> Fail', err)
        reject(err)
      })
    })
  }
  useEffect(() => {
    if (needUpdate) {
      setIsUpdating(true)
      setNeedUpdate(false)
      _fetchItems().finally(() => {
        setIsUpdating(false)
      })
    }
  }, [ needUpdate ])
  
  useEffect(() => {
    setIsFetchingItems(true)
    _fetchItems()
      .finally(() => {
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
      onClose: () => {
        setNeedUpdate(true)
      },
      content: (
        <InfoForm
          requestId={requestId}
        />
      )
    })
  }
  
  if (isFetching) {
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
          {isUpdating && ( <LoadingIndicator /> )}
          {isFetchingItems && ( <LoadingSplash /> )}
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
                          amount, from, id, inUtx, status, target
                        } = item
                        return (
                          <TableRow key={id}>
                            <TableCell>{id}</TableCell>
                            <TableCell>{formatUnixTimestamp(inUtx)}</TableCell>
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
                            <TableCell>
                              {(status == REQUEST_STATUS.READY && target && target.id == id) ? (
                                <span className="text-green-500 font-bold">{`Ready`}</span>
                              ) : (
                                <>
                                  {status == REQUEST_STATUS.READY && (!target || target.id == 0) && (
                                    <span className="text-cyan-700 font-bold">{`Not finished`}</span>
                                  )}
                                  {status == REQUEST_STATUS.PENDING && (Number(inUtx) + Number(refundTimeout) < sourceTimestamp) ? (
                                    <span className="text-red-600 font-bold">{`Need refund`}</span>
                                  ) : (
                                    <>
                                      {status == REQUEST_STATUS.PENDING && (
                                        <span className="text-blue-600 font-bold">{`Pengind`}</span>
                                      )}
                                    </>
                                  )}
                                  {status == REQUEST_STATUS.REJECT && (
                                    <span className="text-red-500 font-bold">{`Rejected`}</span>
                                  )}
                                  {status == REQUEST_STATUS.REFUNDED && (
                                    <span className="text-cyan-700 font-bold">{`Refunded`}</span>
                                  )}
                                </>
                              )}
                            </TableCell>
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
