import React, { useState } from "react";
import HelpTooltip from "@/components/HelpTooltip";

const InputBasisPoint = (props) => {
  const {
    label,
    value,
    setValue,
    isEditable,
    basisPoint = 100,
    onBlur,
    onFocus,
    error, 
    errorMessage,
    tooltip,
    disabled,
    buttons,
  } = props
  const percentage = value / basisPoint;
  
  const placeHolderClass = `absolute bg-white right-2 top-2 bottom-2 text-gray-500 font-bold content-center`
  const placeHolderClassDisabled = `absolute bg-gray-300  right-2 top-2 bottom-2 text-gray-500 font-bold content-center`
  
  return (
    <div>
      <label htmlFor={label} className="block text-gray-700 font-bold mb-2">
        {label}
        {tooltip && (
          <HelpTooltip text={tooltip} />
        )}
      </label>
      {isEditable ? (
        <div className="w-full flex items-center space-x-2">
          <div className="relative flex-1">
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

            {/* Плейсхолдер с процентами */}
            <span className={(disabled) ? placeHolderClassDisabled : placeHolderClass}>
              = {percentage.toFixed(2)}%
            </span>

            {/* Сообщение об ошибке */}
            {error && errorMessage && (
              <div
                className="absolute bottom-full left-0 w-full bg-red-200 border-red-500 border text-red-800 p-1 pr-2 pl-2"
              >
                {errorMessage}
              </div>
            )}
          </div>
          {buttons && (
            <>{buttons}</>
          )}
        </div>
      ) : (
        <p className="text-gray-500">{value} ({percentage}%}</p>
      )}
    </div>
  );
};

export default InputBasisPoint;