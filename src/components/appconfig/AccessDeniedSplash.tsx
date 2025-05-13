import React from "react";
import  { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'

const AccessDeniedSplash = ({ adminAddress }) => {
  const {
    injectedAccount
  } = useInjectedWeb3()
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      {/* Форма по центру */}
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
        <p className="text-gray-700 mb-6">
          To access, switch to the administrator wallet
        </p>
        <p className="text-gray-700 mb-2 font-bold">Administrator address:</p>
        <p className="text-blue-500 font-bold mb-6">{adminAddress}</p>
        {injectedAccount && (
          <>
            <p className="text-gray-700 mb-2 font-bold">Your address:</p>
            <p className="text-blue-500 font-bold mb-6">{injectedAccount}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccessDeniedSplash;