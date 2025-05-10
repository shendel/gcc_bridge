import React, { useState } from "react";

const Tabs = (props) => {
  const {
    tabs,
    activeTab,
    onTabChanged,
    onConfirmTabChange = (currentTab, newTab, doChange) => { doChange() },
    children,
  } = props
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Обработчик клика на вкладку
  const handleTabClick = (tabKey) => {
    if (!tabs.find((tab) => tab.key === tabKey).disabled) {
      onConfirmTabChange( currentTab, tabKey, () => {
        setCurrentTab(tabKey);
        onTabChanged(tabKey); // Вызываем callback при изменении вкладки
      })
    }
  };

  return (
    <div>
      {/* Набор вкладок */}
      <div className="flex overflow-x-auto mt-2 pl-2 pr-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`px-4 py-2 rounded-tl-lg rounded-tr-lg ${
              currentTab === tab.key
                ? "bg-blue-500 text-white border-b-2 border-b-blue-500"
                : tab.disabled
                ? "bg-gray-200 cursor-not-allowed border-b-2 border-gray-300 border-b-blue-500"
                : "bg-gray-100 hover:bg-gray-200 border-b-2 border-gray-200 border-b-blue-500"
            }`}
            disabled={tab.disabled}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Содержимое активной вкладки */}
      <div className="rounded shadow-md border-2 border-blue-600 p-3" style={{marginTop: '-2px'}}>
        {children}
      </div>
    </div>
  );
};

export default Tabs;