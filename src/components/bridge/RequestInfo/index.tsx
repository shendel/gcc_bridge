import React, { useState, useEffect } from "react";
import approveToken from '@/helpers/approveToken'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import BigNumber from "bignumber.js"
import { toWei, fromWei } from '@/helpers/wei'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { GET_CHAIN_BYID } from '@/web3/chains'
import { useNotification } from "@/contexts/NotificationContext";
import { getTransactionLink, getShortTxHash } from '@/helpers/etherscan'
import { useMainnetBridge } from '@/contexts/MainnetBridgeContext'
import { useTargetBridge} from '@/contexts/TargetBridgeContext'
import { useConfirmationModal } from '@/components/ConfirmationModal'
import fetchRequest from '@/helpers_bridge/fetchRequest'
import LoadingSplash from '@/components/LoadingSplash'
import formatUnixTimestamp from '@/helpers/formatUnixTimestamp'
import Switcher from '../Switcher'
import refundRequest from '@/helpers_bridge/refundRequest'


import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS,
  REJECT_ACTIONS_LABELS,
  REJECT_ACTIONS
} from '@/helpers_bridge/constants'

import {
  MAINNET_CONTRACT,
  MAINNET_CHAIN_ID,
  MAINNET_TOKEN,
  TARGET_CHAIN_ID,
  TARGET_CHAIN_CONTRACT
} from '@/config'

const RequestInfo = (props) => {
  const {
    requestId,
    on404
  } = props

  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId,
    switchNetwork,
    isSwitchingNetwork,
  } = useInjectedWeb3()

  const {
    contractInfo: sourceChainInfo,
  } = useMainnetBridge()
  const {
    contractInfo: targetChainInfo,
  } = useTargetBridge()

  const { addNotification } = useNotification();
  const { openModal, closeModal } = useConfirmationModal()

  const [ sourceRequest, setSourceRequest ] = useState(false)
  const [ sourceTimestamp, setSourceTimestamp ] = useState(0)
  const [ targetRequest, setTargetRequest ] = useState(false)
  const [ targetTimestamp, setTargetTimestamp ] = useState(0)
  const [ isFetching, setIsFetching ] = useState(false)
  const [ needUpdate, setNeedUpdate ] = useState(true)
  const [ isRefunding, setIsRefunding ] = useState(false)

  useEffect(() => {
    if (needUpdate) {
      setNeedUpdate(false)
      setIsFetching(true)
      fetchRequest({
        requestId,
        address: MAINNET_CONTRACT,
        chainId: MAINNET_CHAIN_ID,
        targetChainId: TARGET_CHAIN_ID,
        targetChainAddress: TARGET_CHAIN_CONTRACT
      }).then((answer) => {
        const {
          sourceRequest,
          sourceTimestamp,
          targetRequest,
          targetTimestamp
        } = answer
        setSourceRequest(sourceRequest)
        setSourceTimestamp(Number(sourceTimestamp))
        setTargetRequest(targetRequest)
        setTargetTimestamp(Number(targetTimestamp))
      }).catch((err) => {}).finally(() => {
        setIsFetching(false)
      })
    }
  }, [ requestId, needUpdate ])

  if (!sourceChainInfo || !targetChainInfo) return (<LoadingSplash />)
  if (!sourceRequest) return (<LoadingSplash />)
  if (sourceRequest.from.toLowerCase() !== injectedAccount.toLowerCase()) return on404()

  
  
  const handleRefund = () => {
    setIsRefunding(true)
    addNotification('info', `Refunding request #${requestId} (${fromWei(sourceRequest.amount, sourceChainInfo.tokenDecimals)} ${sourceChainInfo.tokenSymbol}). Confirm transaction`)
    
    refundRequest({
      activeWeb3: injectedWeb3,
      address: MAINNET_CONTRACT,
      requestId,
      onTrx: (txHash) => {
        addNotification('info', 'Refund transaction', getTransactionLink(MAINNET_CHAIN_ID, txHash), getShortTxHash(txHash))
      },
      onSuccess: (info) => {
        setIsRefunding(false)
        setNeedUpdate(true)
        addNotification('success', `Bridge request #${requestId} successfull refunded`)
      },
      onError: () => {
        addNotification('error', 'Fail refund tokens')
        setIsRefunding(false)
      }
    }).catch((err) => {})
  }

  return (
    <div className="w-full p-6">
      {isFetching && ( <LoadingSplash /> )}
      <Switcher
        tabs={[
          { title: `Bridge`, key: 'BRIDGE' },
          { title: 'History', key: 'HISTORY' }
        ]}
        active={`NONE`}
        onClick={(tab) => {
          if (tab == 'BRIDGE') window.location.hash = '/'
          if (tab == 'HISTORY') window.location.hash = '/history'
        }}
      />
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
        <div>
          <div className="block text-gray-700 font-bold mb-2 text-center text-xl ">
            {`Bridging `}
            <span className="text-blue-600">{sourceChainInfo.tokenSymbol}</span>
            {` to `}
            <span className="text-blue-600">
              {GET_CHAIN_BYID(TARGET_CHAIN_ID).name}
            </span>
          </div>
        </div>
        <div>
          <div className="block text-gray-700 font-bold text-center text-x2">
            {`Bridge request #${requestId}`}
          </div>
          <div className="block text-gray-700 font-bold text-center text-x2">
            {formatUnixTimestamp(sourceRequest.inUtx)}
          </div>
        </div>
        <div className="pt-2 mt-2 border-t border-stone-500">
          <div className="block text-gray-700 font-bold text-x2">
            {`You sent from`}
            <span>{` `}</span>
            <span className="text-blue-600">
              {GET_CHAIN_BYID(MAINNET_CHAIN_ID).name}
            </span>
          </div>
        </div>
        <div>
          <div className="block text-gray-700 text-right font-bold text-x1">
            <span>{fromWei(sourceRequest.amount, sourceChainInfo.tokenDecimals)}</span>
            <span>{` `}</span>
            <span className="text-blue-600">
              {sourceChainInfo.tokenSymbol}
            </span>
          </div>
        </div>
        <div className="pt-2 mt-2 border-t border-stone-500">
          <div className="block text-gray-700 font-bold text-x2">
            {`You recieve at`}
            <span>{` `}</span>
            <span className="text-blue-600">{GET_CHAIN_BYID(TARGET_CHAIN_ID).name}</span>
          </div>
        </div>
        <div>
          <div className="block text-gray-700 text-right font-bold text-x1">
            <span>{fromWei( new BigNumber(sourceRequest.amount).multipliedBy(targetChainInfo.bridgeRate), targetChainInfo.tokenDecimals)}</span>
            <span>{` `}</span>
            <span className="text-blue-600">
              {targetChainInfo.tokenSymbol}
            </span>
          </div>
        </div>
        <div className="pt-2 mt-2 border-t border-stone-500">
          <div className="block text-gray-700 text-right font-bold text-x1 flex justify-between">
            <span>{`Request status`}</span>
            {sourceRequest.status == REQUEST_STATUS.REFUNDED && (
              <span className="text-green-600">{`Refunded`}</span>
            )}
            {sourceRequest.status == REQUEST_STATUS.PENDING && (
              <>
                {(Number(sourceRequest.inUtx) + Number(sourceChainInfo.refundTimeout) < sourceTimestamp) ? (
                  <span className="text-red-600">{`Need refund`}</span>
                ) : (
                  <span className="text-emerald-600">{`Pending`}</span>
                )}
              </>
            )}
            {sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == 0 && (
              <span className="text-emerald-600">{`Processing`}</span>
            )}
            {sourceRequest.status == REQUEST_STATUS.READY && sourceRequest.id == targetRequest.id && (
              <span className="text-green-600">{`Ready. Bridged`}</span>
            )}
            {sourceRequest.status == REQUEST_STATUS.REJECT && (
              <span className="text-red-600">{`Rejected`}</span>
            )}
          </div>
        </div>
        {sourceRequest.status == REQUEST_STATUS.READY && sourceRequest.id == targetRequest.id && (
          <div className="pt-2 mt-2 border-t border-stone-500">
            <div className="block text-gray-700 text-right font-bold text-x1 flex justify-between">
              <span>{`Bridget at`}</span>
              <span className="text-emerald-600">
                {formatUnixTimestamp(targetRequest.outUtx)}
              </span>
            </div>
          </div>
        )}
        {sourceRequest.status == REQUEST_STATUS.REJECT && sourceRequest.remark != "" && (
          <div className="pt-2 mt-2 border-t border-stone-500">
            <div className="block text-gray-700 text-left font-bold text-x1">
              {`Reject reason`}
            </div>
            <div className="text-red-600 font-bold">
              {sourceRequest.remark}
            </div>
          </div>
        )}
        <div className="pt-2 mt-2 border-t border-stone-500">
          {sourceRequest.status == REQUEST_STATUS.PENDING && (Number(sourceRequest.inUtx) + Number(sourceChainInfo.refundTimeout) < sourceTimestamp) && (
            <div className="pb-2">
              <Button color={`red`} isLoading={isRefunding} fullWidth={true} onClick={handleRefund}>
                {`Refund request`}
              </Button>
            </div>
          )}
          <div>
            <Button fullWidth={true} onClick={() => { window.location.hash = '/history' }}>
              {`Back to requests`}
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  )
};

export default RequestInfo;