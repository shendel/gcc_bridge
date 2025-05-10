export const shortAddress = (ethAddress) => {
  return `${ethAddress.substr(0,6)}...${ethAddress.substr(-4,4)}`
}