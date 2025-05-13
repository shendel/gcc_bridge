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
import acceptRequest from '@/helpers_bridge/acceptRequest'
import approveToken from '@/helpers/approveToken'
import finishRequest from '@/helpers_bridge/finishRequest'
import InfoField from '@/components/appconfig/ui/InfoField'


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

const AcceptRequestModal = (props) => {
  const {
    requestId,
    sourceRequest: _source,
    targetRequest: _target,

  } = props

  const [ sourceRequest, setSourceRequest ] = useState(_source)
  const [ targetRequest, setTargetRequest ] = useState(_target)
  const [ needRefresh, setNeedRefresh ] = useState(false)
  useEffect(() => {
    if (needRefresh) {
      setNeedRefresh(false)
      fetchRequest({
        requestId,
        chainId: MAINNET_CHAIN_ID,
        address: MAINNET_CONTRACT,
        targetChainId: TARGET_CHAIN_ID,
        targetChainAddress: TARGET_CHAIN_CONTRACT,
      }).then(({ sourceRequest, targetRequest }) => {
        setSourceRequest(sourceRequest)
        setTargetRequest(targetRequest)
      }).catch((err) => {})
    }
  }, [ requestId, needRefresh ])
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
    contractInfo: targetInfo,
    fetchBridgeInfo
  } = useTargetBridge()
  
  if (!mainnetInfo || !targetInfo) return null
  const [ allowance , setAllowance ] = useState(targetInfo?.oracleAllowance)
  
  const [ isStepOne, setIsStepOne ] = useState(false)
  const handleStepOne = () => {
    setIsStepOne(true)
    addNotification('info', `Burning ${fromWei(sourceRequest.amount, mainnetInfo.tokenDecimals)} ${mainnetInfo.tokenSymbol} at "${GET_CHAIN_BYID(MAINNET_CHAIN_ID)}" . Confirm transaction`)
    
    acceptRequest({
      activeWeb3: injectedWeb3,
      address: MAINNET_CONTRACT,
      requestId,
      onTrx: (txHash) => {
        addNotification('info', 'Transaction', getTransactionLink(MAINNET_CHAIN_ID, txHash), getShortTxHash(txHash))
      },
      onSuccess: (info) => {
        setIsStepOne(false)
        setNeedRefresh(true)
        addNotification('success', `#${requestId} successfull`)
      },
      onError: () => {
        addNotification('error', 'Fail')
        setIsStepOne(false)
      }
    }).catch((err) => {})
  }
  const [ isApproving, setIsApproving ] = useState(false)
  
  const handleApprove = () => {
    addNotification('info', `Approving ${recieveAmount}. Confirm transaction`)
    setIsApproving(true)
    approveToken({
      activeWallet: injectedAccount,
      activeWeb3: injectedWeb3,
      tokenAddress: targetInfo.tokenAddress,
      approveFor: TARGET_CHAIN_CONTRACT,
      weiAmount: new BigNumber(sourceRequest.amount).multipliedBy(targetInfo.bridgeRate),
      onTrx: (txHash) => {
        addNotification('info', 'Approving transaction', getTransactionLink(TARGET_CHAIN_ID, txHash), getShortTxHash(txHash))
      },
      onSuccess: () => {
        addNotification('success', `${recieveAmount} successfull approved`)
        setIsApproving(false)
        setAllowance(new BigNumber(sourceRequest.amount).multipliedBy(targetInfo.bridgeRate))
      },
      onError: () => {
        addNotification('error', 'Fail approving')
        setIsApproving(false)
      }
    }).catch((err) => {})
  }
  
  const [ isStepTwo, setIsStepTwo ] = useState(false)
  const handleStepTwo = () => {
    setIsStepTwo(true)
    addNotification('info', `Sending ${recieveAmount} at "${GET_CHAIN_BYID(MAINNET_CHAIN_ID)}" . Confirm transaction`)
    
    finishRequest({
      activeWeb3: injectedWeb3,
      address: TARGET_CHAIN_CONTRACT,
      requestId,
      to: sourceRequest.from,
      weiAmount: sourceRequest.amount,
      onTrx: (txHash) => {
        addNotification('info', 'Transaction', getTransactionLink(MAINNET_CHAIN_ID, txHash), getShortTxHash(txHash))
      },
      onSuccess: (info) => {
        setIsStepTwo(false)
        setNeedRefresh(true)
        addNotification('success', `#${requestId} successfull finalized`)
      },
      onError: () => {
        addNotification('error', 'Fail')
        setIsStepTwo(false)
      }
    }).catch((err) => {})
  }
  
  const needApprove = new BigNumber(sourceRequest.amount).multipliedBy(targetInfo.bridgeRate).isGreaterThan(allowance)
  const lowBalance = new BigNumber(sourceRequest.amount).multipliedBy(targetInfo.bridgeRate).isGreaterThan(targetInfo.oracleBalance)
  
  const burnAmount = `${fromWei(sourceRequest.amount, mainnetInfo.tokenDecimals)} ${mainnetInfo.tokenSymbol}`
  const recieveAmount = `${fromWei(new BigNumber(sourceRequest.amount).multipliedBy(targetInfo.bridgeRate), targetInfo.tokenDecimals)} ${targetInfo.tokenSymbol}`
  return (
    <>
      <Label>{`Exchange rate`}</Label>
      <Input
        value={targetInfo.bridgeRate}
        disabled={true}
      />
      <Label>{`Burn amount`}</Label>
      <Input
        value={burnAmount}
        disabled={true}
      />
      <Label>{`User recive`}</Label>
      <Input
        value={recieveAmount}
        disabled={true}
      />
      {sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == sourceRequest.id ? (
        <div className="mt-2">
          <InfoField>{`Bridge request successfull approved and finished`}</InfoField>
        </div>
      ) : (
        <>
          <Label>{`Step 1 - Burn ${burnAmount} at "${GET_CHAIN_BYID(MAINNET_CHAIN_ID).name}"`}</Label>
          {sourceRequest.status == REQUEST_STATUS.PENDING && (
            <div className="mt-2">
              {injectedChainId != MAINNET_CHAIN_ID ? (
                <Button color={`blue`} fullWidth={true} onClick={() => { switchNetwork(MAINNET_CHAIN_ID) }}>
                  {`Switch to "${GET_CHAIN_BYID(MAINNET_CHAIN_ID).name}"`}
                </Button>
              ) : (
                <Button color={`green`} fullWidth={true} onClick={handleStepOne} isLoading={isStepOne}>
                  {`Process. Burn tokens at "${GET_CHAIN_BYID(MAINNET_CHAIN_ID).name}"`}
                </Button>
              )}
            </div>
          )}
          {sourceRequest.status == REQUEST_STATUS.READY && (
            <Label>{`Step 1 - Done`}</Label>
          )}
          
          {sourceRequest.status == REQUEST_STATUS.READY && targetRequest.id == 0 && (
            <>
              <Label>{`Step 2 - Send ${recieveAmount} to user at ${GET_CHAIN_BYID(TARGET_CHAIN_ID).name}`}</Label>
              <div className="mt-2">
                {injectedChainId != TARGET_CHAIN_ID ? (
                  <Button color={`blue`} fullWidth={true} onClick={() => { switchNetwork(TARGET_CHAIN_ID) }}>
                    {`Switch to "${GET_CHAIN_BYID(TARGET_CHAIN_ID).name}"`}
                  </Button>
                ) : (
                  <>
                    {lowBalance ? (
                      <Button color={`red`} fullWidth={true}>{`Low Token balance`}</Button>
                    ) : (
                      <>
                        {needApprove ? (
                          <Button color={`green`} fullWidth={true} onClick={handleApprove} isLoading={isApproving}>
                            {`Approve ${recieveAmount}`}
                          </Button>
                        ) : (
                          <Button color={`green`} fullWidth={true} onClick={handleStepTwo} isLoading={isStepTwo}>
                            {`Process. Send tokens at "${GET_CHAIN_BYID(TARGET_CHAIN_ID).name}"`}
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
      <div className="mt-2">
        <Button fullWidth={true} color={`gray`} onClick={() => { closeModal('ACCEPT_REQUEST') }}>{`Close`}</Button>
      </div>
    </>
  )
}

export default AcceptRequestModal

