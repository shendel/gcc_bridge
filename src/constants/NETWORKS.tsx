const NETWORKS = {
  energy: {
    chainId: 2800500,
    name: 'EnergyChain',
    nativeCurrency: {
      name: "Energy",
      symbol: "ENERGY",
      decimals: 18,
    },
    rpc: 'https://rpc.energy-blockchain.ru/',
    explorer: '#',
    multicall: '0x48d7ac38530697aDB91061B6D141C8c763edE565',
    testnet: true,
  },
  energy_localhost: {
    chainId: 1800500,
    name: 'EnergyChain-Localhost',
    nativeCurrency: {
      name: "Energy",
      symbol: "ENERGY",
      decimals: 18,
    },
    rpc: 'https://rpc.energy-blockchain.ru/', //'http://rpc.proxima:8545/',
    explorer: 'http://explorer.proxima/',
    multicall: '0x83048f0Bf34FEeD8CEd419455a4320A735a92e9d',
    testnet: true,
  },
  premium_coffee: {
    chainId: 1800510,
    name: 'PremiumCoffee Blockchain',
    nativeCurrency: {
      name: "Energy",
      symbol: "ENERGY",
      decimals: 18,
    },
    rpc: 'https://rpc.energy-blockchain.ru',
    explorer: '#',
    multicall: '0x7A29Ad35190342D2A5125b29Cf5063B299d9aAFf',
    testnet: true,
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://eth-sepolia.g.alchemy.com/v2/eV40AoRwFdzusyW_9htirAoRXSMssQ0E",
    explorer: "https://sepolia.etherscan.io/",
    multicall: '0xfdd7067530db45CFF766Fe2C26e3590C3B320C4c',
    storage: '0x19b61c676e4288c78e10635e59423991111ccea4',
    exStorage: '0x06Cb12E810f996742be7afC993FFf5b8540ADcca',
    testnet: true,
  },
  mainnet: {
    chainId: 1,
    name: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://eth-mainnet.g.alchemy.com/v2/eV40AoRwFdzusyW_9htirAoRXSMssQ0E",
    explorer: "https://etherscan.io",
    multicall: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    ensUniversalResolver: "0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",
  },
  bsc: {
    chainId: 56,
    name: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    rpc: "https://bsc-dataseed1.binance.org/",
    explorer: "https://bscscan.com",
    multicall: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
    storage: '0xa7472f384339D37EfE505a1A71619212495A973A',
    exStorage: '0x05b12174a320967698f1e432793d6f5b3b83bb7c'
  },
  bsc_test: {
    chainId: 97,
    name: "BSC testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    rpc: "https://data-seed-prebsc-1-s2.binance.org:8545",
    explorer: "https://testnet.bscscan.com",
    multicall: '0x5d311801328eCa19CfFBe917d9814C95710ce1b1',
    testnet: true,
  },
  matic: {
    chainId: 137,
    name: "Polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpc: "https://polygon-rpc.com/",
    explorer: "https://polygonscan.com/",
    multicall: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  },
  mumbai: {
    chainId: 80001,
    name: "Polygon testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpc: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    explorer: "https://mumbai.polygonscan.com/",
    multicall: '0x6aa1bdc159e28beca44cc7f1a260a25e7b63f53d',
    testnet: true,
  },
  fantom: {
    chainId: 250,
    name: "Fantom Opera",
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18
    },
    rpc: "https://rpc.ftm.tools/",
    explorer: "https://ftmscan.com",
    multicall: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5'
  },
  arbeth_mainnet: {
    chainId: 42161,
    name: "Arbitrum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io/",
    multicall: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  },
  xdai: {
    chainId: 100,
    name: "Gnosis Mainnet (xDai)",
    nativeCurrency: {
      name: "XDAI",
      symbol: "XDAI",
      decimals: 18
    },
    rpc: "https://rpc.gnosischain.com",
    explorer: "https://blockscout.com/xdai/mainnet",
    multicall: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  }
}

export default NETWORKS