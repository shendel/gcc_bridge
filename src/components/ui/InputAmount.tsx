import { useState, useEffect } from 'react'
import { fromWei, toWei } from '@/helpers/wei'
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import fetchTokenBalance from '@/helpers/fetchTokenBalance'
import BigNumber from "bignumber.js"

const InputAmount = (props) => {
  const {
    value,
    onChange,
    label = 'Stake Amount',
    isDisabled,
    tokenInfo = {
      symbol: 'Token',
      decimals: 18
    },
    minimumAmount = 0,
    tokenBalance,
    setHasAmountError = () => {}
  } = props

  const [ notEnoghtBalance, setNotEnoghtBalance ] = useState(false)
  const [ minAmountError, setMinimumAmount ] = useState(false)
  
  useEffect(() => {
    const notEnoghtBalance = new BigNumber(value).isGreaterThan(tokenBalance)
    const minAmountError = new BigNumber(value).isLessThan(minimumAmount)

    setHasAmountError(notEnoghtBalance || minAmountError)
    setNotEnoghtBalance(notEnoghtBalance)
    setMinimumAmount(minAmountError)
  }, [ value ])
  
  const inputNormal = `w-full px-4 py-2 ${(notEnoghtBalance || minAmountError) ? 'text-red-500': 'text-black'} border border-gray-300 rounded-l focus:outline-none focus:border-blue-500`
  const inputDisabled = `w-full px-4 py-2 bg-gray-300 border border-gray-700 rounded-l focus:outline-none focus:border-blue-500`
  
  const buttonNormal = `bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 border border-blue-500 rounded-r`
  const buttonDisabled = `bg-gray-500 text-white px-4 py-2 border border-gray-700 rounded-r`
  return (
    <>
      <div className="flex place-content-between">
        <div className="block text-gray-700 mb-2 font-bold">
          {label}
        </div>
        <div className={`block  font-bold mb-2 ${(notEnoghtBalance) ? 'text-red-500' : 'text-gray-700'}`}>
          <span>Balance:</span>
          <span className={`pl-1 pr-1`}>{tokenBalance}</span>
          <span>{tokenInfo.symbol}</span>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          id="stakeAmount"
          value={value}
          onChange={(e) => { if (!isDisabled) { onChange(e.target.value) }}}
          className={(isDisabled) ? inputDisabled : inputNormal}
        />
        <button onClick={() => { if (!isDisabled) { onChange(tokenBalance) } }} className={(isDisabled) ? buttonDisabled : buttonNormal}>
          MAX
        </button>
      </div>
      {minimumAmount && (
        <div className="flex place-content-between">
          <div className={`block ${(minAmountError) ? 'text-red-500' : 'text-gray-700'} mb-2 font-bold`}>
            {`Min: ${minimumAmount} ${tokenInfo.symbol}`}
          </div>
        </div>
      )}
    </>
  )
}



export default InputAmount