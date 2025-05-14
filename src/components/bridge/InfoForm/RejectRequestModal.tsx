import { useState, useEffect } from 'react'
import Button from '@/components/appconfig/ui/Button'
import Input from '@/components/appconfig/ui/Input'
import Label from '@/components/appconfig/ui/Label'
import Select from '@/components/appconfig/ui/Select'
import { useMainnetBridge } from '@/contexts/MainnetBridgeContext'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import { useNotification } from "@/contexts/NotificationContext"
import { useConfirmationModal } from '@/components/ConfirmationModal'
import rejectRequest from '@/helpers_bridge/rejectRequest'
import { getAddressLink, getTransactionLink, getShortTxHash } from '@/helpers/etherscan'
import { GET_CHAIN_BYID } from '@/web3/chains'
import {
  MAINNET_CHAIN_ID,
  MAINNET_CONTRACT,
} from '@/config'

const RejectRequestModal = (props) => {
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

  const { addNotification } = useNotification()
  
  const {
    contractInfo: mainnetInfo,
    contractInfo,
    isFetching
  } = useMainnetBridge()
  
  const [ rejectAction, setRejectAction ] = useState(0)
  const [ rejectReason, setRejectReason ] = useState(``)
  
  const [ isRejecting, setIsRejecting ] = useState(false)
  
  const handleReject = () => {
    setIsRejecting(true)
    addNotification('info', `Reject request #${requestId} . Confirm transaction`)
    
    rejectRequest({
      activeWeb3: injectedWeb3,
      address: MAINNET_CONTRACT,
      requestId,
      rejectAction,
      rejectReason,
      onTrx: (txHash) => {
        addNotification('info', 'Transaction', getTransactionLink(MAINNET_CHAIN_ID, txHash), getShortTxHash(txHash))
      },
      onSuccess: (info) => {
        setIsRejecting(false)
        addNotification('success', `#${requestId} successfull rejected`)
        closeModal('REJECT_REQUEST', { data: { needUpdate: true } } )
      },
      onError: () => {
        addNotification('error', 'Fail')
        setIsRejecting(false)
      }
    }).catch((err) => {})
  }
  return (
    <>
      <Label>{`Reject action`}</Label>
      <Select value={rejectAction} setValue={setRejectAction}>
        <option value={0}>{`Refund (return tokens back to user)`}</option>
        <option value={1}>{`Burn (destroy tokens)`}</option>
        <option value={2}>{`Take tokens (send tokens to Oracle ${mainnetInfo.owner})`}</option>
      </Select>
      <Label>{`Reason for reject`}</Label>
      <Input value={rejectReason} setValue={setRejectReason} />
      <div className="grid grid-cols-2 gap-2 mt-2">
        {injectedChainId != MAINNET_CHAIN_ID ? (
          <Button color={`blue`} onClick={() => { switchNetwork(MAINNET_CHAIN_ID) }}>
            {`Swith to "${GET_CHAIN_BYID(MAINNET_CHAIN_ID).name}" for reject`}
          </Button>
        ) : (
          <Button color={`red`} onClick={handleReject} isLoading={isRejecting}>{`Confirm reject`}</Button>
        )}
        <Button color={`gray`} onClick={() => { closeModal('REJECT_REQUEST') }} isLoading={isRejecting}>{`Cancel`}</Button>
      </div>
    </>
  )
}


export default RejectRequestModal