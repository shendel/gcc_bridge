import { useState, useEffect } from 'react'
import fetchRequest from '@/helpers_bridge/fetchRequest'
import Label from '@/components/appconfig/ui/Label'
import Input from '@/components/appconfig/ui/Input'
import Button from '@/components/appconfig/ui/Button'
import { useConfirmationModal } from '@/components/ConfirmationModal'
import { useTargetBridge } from '@/contexts/TargetBridgeContext'
import { useMainnetBridge } from '@/contexts/MainnetBridgeContext'
import LoadingPlaceholder from '@/components/LoadingPlaceholder'
import BigNumber from "bignumber.js"
import { fromWei } from '@/helpers/wei'
import { getAddressLink, getTransactionLink, getShortTxHash } from '@/helpers/etherscan'
import { GET_CHAIN_BYID } from '@/web3/chains'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useNotification } from "@/contexts/NotificationContext"
import formatUnixTimestamp from '@/helpers/formatUnixTimestamp'
import LoadingSplash from '@/components/LoadingSplash'

import AcceptRequestModal from './AcceptRequestModal'
import RejectRequestModal from './RejectRequestModal'

import {
  MAINNET_CHAIN_ID,
  MAINNET_CONTRACT,
  TARGET_CHAIN_ID,
  TARGET_CHAIN_CONTRACT,
} from '@/config'

import {
  REQUEST_STATUS,
  REQUEST_STATUS_LABELS,
  REJECT_ACTIONS_LABELS
} from '@/helpers_bridge/constants'

const InfoForm = (props) => {
  const {
    requestId
  } = props

  const {
    openModal,
    closeModal
  } = useConfirmationModal()
  
  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId,
    switchNetwork,
    isSwitchingNetwork,
  } = useInjectedWeb3()
  console.log('>>> injectedChainId', injectedChainId)
  const { addNotification } = useNotification()
  
  const {
    contractInfo: mainnetInfo,
    contractInfo,
    isFetching
  } = useMainnetBridge()
  
  const {
    contractInfo: targetInfo
  } = useTargetBridge()
  
  const [ sourceRequest, setSourceRequest ] = useState(false)
  const [ targetRequest, setTargetRequest ] = useState(false)
  const [ requestFetched, setRequestFetched ] = useState(false)
  const [ requestFetching, setRequestFetching ] = useState(true)
  const [ needUpdate, setNeedUpdate ] = useState(true)

  useEffect(() => {
    if (needUpdate) {
      setNeedUpdate(false)
      setRequestFetching(true)
      console.log('>>> update')
      fetchRequest({
        requestId,
        chainId: MAINNET_CHAIN_ID,
        address: MAINNET_CONTRACT,
        targetChainId: TARGET_CHAIN_ID,
        targetChainAddress: TARGET_CHAIN_CONTRACT,
      }).then(({ sourceRequest, targetRequest }) => {
        setRequestFetched(true)
        console.log(sourceRequest, targetRequest)
        setSourceRequest(sourceRequest)
        setTargetRequest(targetRequest)
        setRequestFetching(false)
      }).catch((err) => {})
    }
  }, [ requestId, needUpdate ])

  if (!mainnetInfo || !targetInfo) return null
  
  const confirmAcceptRequest = () => {
    openModal({
      title: `Accept bridge request #${requestId}`,
      hideBottomButtons: true,
      fullWidth: true,
      id: 'ACCEPT_REQUEST',
      onClose: (data) => {
        setNeedUpdate(true)
      },
      content: (
        <AcceptRequestModal
          requestId={requestId}
          sourceRequest={sourceRequest}
          targetRequest={targetRequest}
        />
      )
    })
  }
  
  const confirmRejectRequest = () => {
    openModal({
      title: `Reject bridge request #${requestId}`,
      hideBottomButtons: true,
      fullWidth: true,
      id: 'REJECT_REQUEST',
      onClose: (data) => {
        if (data && data.needUpdate) {
          setNeedUpdate(true)
        }
      },
      content: (
        <RejectRequestModal
          requestId={requestId}
        />
      )
    })
  }
  
  let redStatus = (sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == 0) ? true : false
  let requestStatus = (sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == 0)
    ? `Step 1 Ready. Tokens burned. Need finish step - 2`
    : REQUEST_STATUS_LABELS[sourceRequest.status]
  
  if (sourceRequest.status == REQUEST_STATUS.PENDING && ((Number(sourceRequest.inUtx) + Number(mainnetInfo.refundTimeout)) < Number(mainnetInfo.timestamp))) {
    requestStatus = 'Need refund by user'
    redStatus = true
  }
  return (
    <>
      <Label>{`Sended from`}</Label>
      {requestFetched ? (
        <Input
          value={sourceRequest.from}
          disabled={true}
          hasLink={getAddressLink(MAINNET_CHAIN_ID, sourceRequest.from)}
        />
      ) : (<LoadingPlaceholder height="42px" />)}
      <Label>{`Amount`}</Label>
      {requestFetched ? (
        <Input
          value={`${fromWei(sourceRequest.amount, mainnetInfo.tokenDecimals)} ${mainnetInfo.tokenSymbol}`}
          disabled={true}
        />
      ) : (<LoadingPlaceholder height="42px" />)}
      <Label>{`Request date/time`}</Label>
      {requestFetched ? (
        <Input
          value={formatUnixTimestamp(sourceRequest.inUtx)}
          disabled={true}
        />
      ) : (<LoadingPlaceholder height="42px" />)}
      <Label>{`Status`}</Label>
      {requestFetched ? (
        <Input
          value={requestStatus}
          disabled={true}
          error={redStatus}
        />
      ) : (<LoadingPlaceholder height="42px" />)}
      {requestFetched && (
        <>
          {sourceRequest.status == REQUEST_STATUS.REJECT && (
            <>
              <Label>{`Reject reason`}</Label>
              <Input
                value={sourceRequest.remark}
                disabled={true}
              />
              <Label>{`Action at reject`}</Label>
              <Input
                value={REJECT_ACTIONS_LABELS[sourceRequest.action]}
                disabled={true}
              />
            </>
          )}          
          {(sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == 0) && (
            <div className="mt-2">
              <Button color={`green`} fullWidth={true} onClick={confirmAcceptRequest}>
                {`Need finish bridging. Tokens dont sended to user`}
              </Button>
            </div>
          )}
          {sourceRequest.status == REQUEST_STATUS.PENDING && ((Number(sourceRequest.inUtx) + Number(mainnetInfo.refundTimeout)) > Number(mainnetInfo.timestamp)) && ( 
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button color={`green`} onClick={confirmAcceptRequest}>
                {`Accept request`}
              </Button>
              <Button color={`red`} onClick={confirmRejectRequest}>
                {`Reject request`}
              </Button>
            </div>
          )}
        </>
      )}
      
      <div className="mt-2">
        <Button
          fullWidth={true}
          color={`gray`}
          onClick={() => { closeModal('REQUEST_INFO') }}
        >
          {`Close`}
        </Button>
      </div>
    </>
  )
}

export default InfoForm

