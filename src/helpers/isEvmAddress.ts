const EVM_ADDRESS_REGEXP = /^0x[A-Fa-f0-9]{40}$/
const isEvmAddress = (value) => typeof value === 'string' && EVM_ADDRESS_REGEXP.test(value)
export default isEvmAddress