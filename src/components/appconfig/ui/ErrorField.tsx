import React from "react";

const ErrorField = (props) => {
  const { message, children } = props
  return (
    <div className="bg-red-100 border border-red-400 rounded-lg p-2 mb-2">
      <div className="flex items-center">
        {/* Значок вопроса */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-red-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" stroke="#FF5733" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m0 5H8.99a2 2 0 01-1.99-1.854l-.77 1.243a2 2 0 01-2.77 -1.854"
          />
        </svg>
        {/* Текст ошибки */}
        <div className="text-red-500 font-bold">{message || children}</div>
      </div>
    </div>
  );
};

export default ErrorField;