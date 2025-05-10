import BigNumber from "bignumber.js"

export const toWei = (amount, decimals = 18) => {
  return new BigNumber(amount).multipliedBy(10 ** decimals).toFixed()
}

export const fromWei = (amount, decimals = 18) => {
  return new BigNumber(amount).div(new BigNumber(10).pow(decimals)).toFixed()
}
