import NETWORKS from '@/constants/NETWORKS'

const SelectBlockchain = (props) => {
  const {
    value,
    onChange,
  } = props

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
    >
      <option value="0">Select blockchain</option>
      <optgroup label={`Mainnet`}>
        {Object.keys(NETWORKS).map((slug) => {
          if (!NETWORKS[slug].testnet) {
            return (
              <option key={slug} value={NETWORKS[slug].chainId}>{NETWORKS[slug].name}</option>
            )
          }
        })}
      </optgroup>
      <optgroup label={`Testnet`}>
        {Object.keys(NETWORKS).map((slug) => {
          if (NETWORKS[slug].testnet) {
            return (
              <option key={slug} value={NETWORKS[slug].chainId}>{NETWORKS[slug].name}</option>
            )
          }
        })}
      </optgroup>
    </select>
  )
}


export default SelectBlockchain