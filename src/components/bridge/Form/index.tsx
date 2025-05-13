import React, { useState, useEffect } from "react";
import InputAmount from '@/components/ui/InputAmount'
import fetchTokenInfo from '@/helpers/fetchTokenInfo'
import fetchTokenAllowance from '@/helpers/fetchTokenAllowance'
import fetchTokenBalance from '@/helpers/fetchTokenBalance'
import approveToken from '@/helpers/approveToken'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import BigNumber from "bignumber.js"
import { toWei, fromWei } from '@/helpers/wei'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { GET_CHAIN_BYID } from '@/web3/chains'
import { useNotification } from "@/contexts/NotificationContext";
import { getTransactionLink, getShortTxHash } from '@/helpers/etherscan'
import bridgeTokens from '@/helpers_bridge/bridgeTokens'
import { useMainnetBridge } from '@/contexts/MainnetBridgeContext'

import {
  MAINNET_CONTRACT,
  MAINNET_CHAIN_ID,
  MAINNET_TOKEN,
  TARGET_CHAIN_ID
} from '@/config'

const Form = (props) => {
  const {
    injectedWeb3,
    injectedAccount,
    injectedChainId,
    switchNetwork,
    isSwitchingNetwork,
  } = useInjectedWeb3()

  const {
    contractInfo,
    isFetching,
  } = useMainnetBridge()
  
  console.log('>>> MainnetBridgeContext', contractInfo)
  const { addNotification } = useNotification();

  const [ tokenInfo, setTokenInfo ] = useState(false)
  const [amount, setAmount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const [ isBalanceFetching, setIsBalanceFetching ] = useState(false)
  const [ tokenBalance, setTokenBalance ] = useState(0)

  const notEnoghtBalance = !!(amount > tokenBalance)
  
  const [ isTokenAllowanceFetching, setIsTokenAllowanceFetching ] = useState(true)
  const [ tokenAllowance, setTokenAllowance ] = useState(0)

  useEffect(() => {
    fetchTokenInfo(MAINNET_TOKEN, MAINNET_CHAIN_ID).then((tokenInfo) => {
      console.log('tokenInfo', tokenInfo)
      setTokenInfo(tokenInfo)
    }).catch((err) => {})
  }, [ MAINNET_CHAIN_ID, MAINNET_TOKEN ])
  useEffect(() => {
    if (injectedAccount && tokenInfo && tokenInfo.address) {
      setTokenBalance(0)
      setIsBalanceFetching(true)
      fetchTokenBalance({
        wallet: injectedAccount,
        tokenAddress: tokenInfo.address,
        chainId: MAINNET_CHAIN_ID,
      }).then((answer) => {
        setIsBalanceFetching(false)
        if (answer) {
          const { normalized } = answer
          setTokenBalance(normalized)
        }
      }).catch((err) => {
        setIsBalanceFetching(false)
        console.log('>>> err', err)
      })
    } else {
      setTokenBalance(0)
    }
  }, [ injectedAccount, tokenInfo ])
  const [ isApproving, setIsApproving ] = useState(false)
  
  const handleApproveToken = () => {
    addNotification('info', `Approving ${tokenInfo.symbol}. Confirm transaction`)
    setIsApproving(true)
    approveToken({
      activeWallet: injectedAccount,
      activeWeb3: injectedWeb3,
      tokenAddress: tokenInfo.address,
      approveFor: MAINNET_CONTRACT,
      weiAmount: toWei(amount, tokenInfo.decimals),
      onTrx: (txHash) => {
        addNotification('info', 'Approving transaction', getTransactionLink(MAINNET_CHAIN_ID, txHash), getShortTxHash(txHash))
      },
      onSuccess: () => {
        addNotification('success', `Token ${tokenInfo.symbol} successfull approved`)
        setIsApproving(false)
        setTokenAllowance(toWei(amount, tokenInfo.decimals))
      },
      onError: () => {
        addNotification('error', 'Fail approving')
        setIsApproving(false)
      }
    }).catch((err) => {})
  }
  
  useEffect(() => {
    if (injectedAccount && MAINNET_CONTRACT && tokenInfo && tokenInfo.address) {
      setIsTokenAllowanceFetching(true)
      fetchTokenAllowance({
        from: injectedAccount,
        to: MAINNET_CONTRACT,
        tokenAddress: tokenInfo.address,
        chainId: MAINNET_CHAIN_ID,
      }).then(({ allowance }) => {
        setTokenAllowance(new BigNumber(allowance))
        setIsTokenAllowanceFetching(false)
      }).catch((err) => {
        console.log('Fail fetch allowance', err)
        setIsTokenAllowanceFetching(false)
        setTokenAllowance(0)
      })
    } else {
      setIsTokenAllowanceFetching(false)
      setTokenAllowance(0)
    }
  }, [ injectedAccount, MAINNET_CONTRACT, tokenInfo ])


  const handleInputChange = (v) => {
    setAmount(v)
  }
  
  const [ hasAmountError, setHasAmountError ] = useState(false)
  
  
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const [ isDepositing, setIsDepositiong ] = useState(false)
  
  const handleBridgeTokens = () => {
    setIsDepositiong(true)
    addNotification('info', `Bridging ${amount} ${tokenInfo.symbol}. Confirm transaction`)
    
    bridgeTokens({
      activeWeb3: injectedWeb3,
      address: MAINNET_CONTRACT,
      amountWei: toWei(amount, tokenInfo.decimals),
      onTrx: (txHash) => {
        addNotification('info', 'Bridge transaction', getTransactionLink(MAINNET_CHAIN_ID, txHash), getShortTxHash(txHash))
      },
      onSuccess: (info) => {
        const {
          events: {
            InitBridge: {
              returnValues: {
                requestId
              }
            }
          }
        } = info
        setIsDepositiong(false)
        addNotification('success', `Bridge request #${requestId} successfull created`)
        
      },
      onError: () => {
        addNotification('error', 'Fail bridge tokens')
        setIsDepositiong(false)
      }
    }).catch((err) => {})
  }
  
  const isNeedApprove = new BigNumber(toWei(amount, tokenInfo.decimals)).isGreaterThan(tokenAllowance)

  if (!tokenInfo) return null
  return (
    <div className="w-full p-6">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
        <div>
          <div className="block text-gray-700 font-bold mb-2 text-center text-xl ">
            {`Bridging `}
            <span className="text-blue-600">{tokenInfo.symbol}</span>
            {` to `}
            <span className="text-blue-600">
              {GET_CHAIN_BYID(TARGET_CHAIN_ID).name}
            </span>
          </div>
          {/* Amount */}
          <div className="mb-4">
            <InputAmount
              value={amount}
              chainId={MAINNET_CHAIN_ID}
              label={`Bridge amount`}
              onChange={setAmount}
              tokenInfo={tokenInfo}
              tokenBalance={tokenBalance}
              setHasAmountError={setHasAmountError}
              isDisabled={isApproving || isDepositing}
              minimumAmount={1}
            />
          </div>
          
          {/* Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="termsCheckbox" className="text-gray-700 cursor-pointer">
              I have read and I accept the{" "}
              <a href="#" className="text-blue-500 underline">
                terms and conditions
              </a>
            </label>
          </div>

          {injectedChainId != MAINNET_CHAIN_ID ? (
            <Button isBold={true} fullWidth={true} onClick={() => { switchNetwork(MAINNET_CHAIN_ID) }}>
              {`Switch to "${GET_CHAIN_BYID(MAINNET_CHAIN_ID).name}"`}
            </Button>
          ) : (
            <>
              {isNeedApprove ? (
                <Button fullWidth={true} isBold={true} isDisabled={!isChecked} onClick={handleApproveToken} isLoading={isApproving}>
                  {`Approve ${amount} ${tokenInfo.symbol}`}
                </Button>
              ) : (
                <Button isDisabled={!isChecked || stakeAmount <= 0} isLoading={isDepositing} fullWidth={true} isBold={true} onClick={handleBridgeTokens}>
                  {`Bridge to "${GET_CHAIN_BYID(TARGET_CHAIN_ID).name}"`}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
};

export default Form;