import React, { useState } from "react";

const InputNumber = (props) => {
  const {
    label,
    value,
    setValue,
    isEditable,
    onBlur,
    onFocus,
    error, 
    errorMessage,
    disabled
  } = props
  
  return (
    <div>
      <label htmlFor={label} className="block text-gray-700 font-bold mb-2">
        {label}
      </label>
      {isEditable ? (
        <div className="relative">
          {/* Поле ввода */}
          <input
            type="number"
            id={label}
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={(e) => { if (!disabled) { setValue(Number(e.target.value)) }}}
            className={`w-full px-4 py-2 ${(disabled) ? 'bg-gray-300 border-gray-500' : 'bg-white'} border rounded focus:outline-none ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {/* Сообщение об ошибке */}
          {error && errorMessage && (
            <div
              className="absolute bottom-full left-0 w-full bg-red-200 border-red-500 border text-red-800 p-1 pr-2 pl-2"
            >
              {errorMessage}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">{value}</p>
      )}
    </div>
  );
};

export default InputNumber;