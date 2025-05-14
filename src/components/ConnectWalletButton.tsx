import React from "react";
import { ConnectWalletButton as Web3Button } from '@/web3/ConnectWalletButton'

const ConnectWalletButton = () => {
  return (
    <div className="w-full p-6">
      <div className="w-full max-w-lg mx-auto">
        <Web3Button
          connectedView={() => { return null }}
          wrongChainView={() => { return null }}
          connectView={(isConnecting, openConnectModal) => {
            return (
              <button
                disabled={isConnecting}
                onClick={openConnectModal}
                className="w-full py-4 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
              >
                Connect Wallet
              </button>
            )
          }}
        />
      </div>
    </div>
  );
};

export default ConnectWalletButton;