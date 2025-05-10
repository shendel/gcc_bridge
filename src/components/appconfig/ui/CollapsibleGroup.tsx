import React, { useState } from "react";

const CollapsibleGroup = (props) => {
  const {
    title,
    children,
    noPadds = false,
    expanded = false,
    slim = false
  } = props
  const [isExpanded, setIsExpanded] = useState(expanded);

  // Обработчик клика по заголовку
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const classOpened = `bg-gray-300 w-full text-left ${(slim) ? 'py-1 px-2' : 'p-4'} rounded-t-lg font-bold text-gray-700 hover:bg-blue-200 focus:outline-none flex items-center justify-between`
  const classClosed = `bg-gray-300 w-full text-left ${(slim) ? 'py-1 px-2' : 'p-4'} rounded font-bold text-gray-700 hover:bg-blue-200 focus:outline-none flex items-center justify-between`
  return (
    <div className="mb-2 mt-2">
      {/* Заголовок группы */}
      <button
        onClick={handleToggle}
        className={isExpanded ? classOpened : classClosed}
      >
        <span>{title}</span>
        {/* Стрелка вверх/вниз */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 transform transition-transform duration-300 ease-in-out`}
          fill="currentColor"
        >
          <polygon
            points={
              !isExpanded ? "0,6 24,6 12,18" : "0,18 24,18 12,6"
            }
          />
        </svg>
      </button>

      {/* Контент группы */}
      {isExpanded && (
        <div className={`bg-white ${(noPadds) ? '' : 'p-4'} rounded-b-lg shadow-md border border-t-0 border-gray-300`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleGroup;