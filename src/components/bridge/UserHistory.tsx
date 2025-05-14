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
import fetchUserRequest from '@/helpers_bridge/fetchUserRequest'
import LoadingPlaceholder from '@/components/LoadingPlaceholder'
import Switcher from './Switcher'

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

import formatUnixTimestamp from '@/helpers/formatUnixTimestamp'

const UserHistory = (props) => {
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
  
  console.log('>>> MainnetBridgeContext', sourceChainInfo)
  console.log('>>> TargetBridgeContext', targetChainInfo)
  
  const { addNotification } = useNotification();
  const { openModal, closeModal } = useConfirmationModal()
  
  const [ isFetching, setIsFetching ] = useState(false)
  const [ userRequests, setUserRequests ] = useState([])
  const [ sourceTimestamp, setSourceTimestamp ] = useState(0)
  const [ targetTimestamp, setTargetTimestamp ] = useState(0)
  useEffect(() => {
    setIsFetching(true)
    fetchUserRequest({
      address:            MAINNET_CONTRACT,
      chainId:            MAINNET_CHAIN_ID,
      user:               injectedAccount,
      targetChainId:      TARGET_CHAIN_ID,
      targetChainAddress: TARGET_CHAIN_CONTRACT,
    }).then((answer) => {
      const {
        sourceTimestamp,
        targetTimestamp,
        requests
      } = answer
      console.log('>>> user request', answer)
      setUserRequests(requests)
      setSourceTimestamp(Number(sourceTimestamp))
      setTargetTimestamp(Number(targetTimestamp))
    }).catch((err) => {
    }).finally(() => {
      setIsFetching(false)
    })
  }, [ injectedAccount ])
  if (!sourceChainInfo || !targetChainInfo) return null

  return (
    <div className="w-full p-6">
      <Switcher
        tabs={[
          { title: `Bridge`, key: 'BRIDGE' },
          { title: 'History', key: 'HISTORY' }
        ]}
        active={`HISTORY`}
        onClick={(tab) => { window.location.hash = '/' }}
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
            {`History of your requests`}
          </div>
        </div>
        
        {userRequests.length > 0 ? (
          <>
            {userRequests.map((request) => {
              const {
                id,
                amount,
                inUtx,
                status,
                target
              } = request
              return (
                <div key={id}
                  className="mt-2 border-t border-stone-500"
                >
                  <div
                    className="cursor-pointer hover:bg-sky-50 p-2"
                    onClick={() => { window.location.hash = `/request/${id}` }}
                  >
                    <div className="flex font-bold text-gray-700">
                      <div className="flex-none" style={{width: '25%'}}>{`#${id}`}</div>
                      <div className="grow text-center">{formatUnixTimestamp(inUtx)}</div>
                      <div className="flex-none text-right" style={{width: '25%'}}>
                        {status == REQUEST_STATUS.PENDING && (Number(inUtx) + Number(sourceChainInfo.refundTimeout) < sourceTimestamp) ? (
                          <span className="text-red-600 ">{`Need refund`}</span>
                        ) : (
                          <>
                            {status == REQUEST_STATUS.PENDING && (
                              <span className="text-emerald-600">{`Pending`}</span>
                            )}
                          </>
                        )}
                        {status == REQUEST_STATUS.READY && (target == undefined || target.id == 0) && (
                          <span className="text-emerald-600">{`Processing`}</span>
                        )}
                        {status == REQUEST_STATUS.READY && target && request.id == target.id && (
                          <span className="text-green-600">{`Ready`}</span>
                        )}
                        {status == REQUEST_STATUS.REJECT && (
                          <span className="text-red-600">{`Rejected`}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-center pt-1 pb-1 text-2xl font-bold text-gray-700">
                      <span>{fromWei(amount, sourceChainInfo.tokenDecimals)}</span>
                      <span>{` `}</span>
                      <span className="text-blue-600">{sourceChainInfo.tokenSymbol}</span>
                      <span>{` > `}</span>
                      <span>{fromWei(new BigNumber(amount).multipliedBy(targetChainInfo.bridgeRate), targetChainInfo.tokenDecimals)}</span>
                      <span>{` `}</span>
                      <span className="text-blue-600">{targetChainInfo.tokenSymbol}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <>
            {isFetching ? (
              <LoadingPlaceholder height="64px" />
            ) : (
              <div className="pt-2 mt-2 border-t border-stone-500">
                <div className="block text-gray-700 font-bold text-center text-x2">
                  {`you have no requests`}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
};

export default UserHistory;