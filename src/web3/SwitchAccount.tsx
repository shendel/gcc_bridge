import React from "react";

const SwitchAccount = () => {
  const handleSwitchAccount = async () => {
    if (window.ethereum) {
      try {
        // Запрашиваем список аккаунтов у MetaMask
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        if (accounts.length > 0) {
          console.log("Selected account:", accounts[0]); // Показываем новый выбранный аккаунт
        } else {
          console.warn("No accounts returned by MetaMask.");
        }
      } catch (error) {
        console.error("Failed to request accounts:", error.message);
      }
    } else {
      console.error("MetaMask is not installed or not detected.");
    }
  };

  return (
    <button
      onClick={handleSwitchAccount}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Switch Account
    </button>
  );
};

export default SwitchAccount;