import React from "react";

const InfoField = ({ iconColor = "text-blue-500", text, children }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-2 mb-2 border border-gray-300 shadow-sm flex items-center">
      {/* Иконка информации */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${iconColor} mr-4`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01"
        />
        <circle cx="12" cy="12" r="8" />
      </svg>

      {/* Текст */}
      <p className="text-gray-700">{text || children}</p>
    </div>
  );
};

export default InfoField;