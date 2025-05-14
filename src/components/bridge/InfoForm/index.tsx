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

  useEffect(() => {
    setRequestFetched(false)
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
    }).catch((err) => {})
  }, [ requestId ])

  if (!mainnetInfo || !targetInfo) return null
  
  const confirmAcceptRequest = () => {
    openModal({
      title: `Accept bridge request #${requestId}`,
      hideBottomButtons: true,
      fullWidth: true,
      id: 'ACCEPT_REQUEST',
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
      content: (
        <RejectRequestModal
          requestId={requestId}
        />
      )
    })
  }
  
  const redStatus = (sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == 0) ? true : false
  const requestStatus = (sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == 0)
    ? `Step 1 Ready. Tokens burned. Need finish step - 2`
    : REQUEST_STATUS_LABELS[sourceRequest.status]
    
  return (
    <>
      {!requestFetched && (
        <LoadingPlaceholder height="128px" />
      )}
      {requestFetched && (
        <>
          <Label>{`Sended from`}</Label>
          <Input
            value={sourceRequest.from}
            disabled={true}
            hasLink={getAddressLink(MAINNET_CHAIN_ID, sourceRequest.from)}
          />
          <Label>{`Amount`}</Label>
          <Input
            value={`${fromWei(sourceRequest.amount, mainnetInfo.tokenDecimals)} ${mainnetInfo.tokenSymbol}`}
            disabled={true}
          />
          <Label>{`Request date/time`}</Label>
          <Input
            value={formatUnixTimestamp(sourceRequest.inUtx)}
            disabled={true}
          />
          <Label>{`Status`}</Label>
          <Input
            value={requestStatus}
            disabled={true}
            error={redStatus}
          />
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
          {sourceRequest.status == REQUEST_STATUS.PENDING && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button color={`green`} onClick={confirmAcceptRequest}>
                {`Accept request`}
              </Button>
              <Button color={`red`} onClick={confirmRejectRequest}>
                {`Reject request`}
              </Button>
            </div>
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
      )}
    </>
  )
}

export default InfoForm

