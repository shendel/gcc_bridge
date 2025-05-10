import React from "react";

const Button = (props) => {
  const {
    children,
    isLoading,
    isDisabled,
    isBold,
    fullWidth,
    color = `blue`,
    onClick
  } = props
  const disabledClass = `relative ${(fullWidth) ? 'w-full' : ''} shadow-md px-4 py-2 rounded transition-bg bg-gray-500 text-gray-100 cursor-not-allowed`
  const normalClass = `relative ${(fullWidth) ? 'w-full' : ''} duration-500 ease-in-out shadow-md px-4 py-2 rounded text-white transition-all bg-${color}-500 hover:bg-${color}-600 active:bg-${color}-800 active:scale-95`

  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading} // Если кнопка заблокирована или идет загрузка
      className={(isDisabled) ? disabledClass : normalClass}
    >
      {/* Анимация загрузки */}
      {isLoading ? (
        <div className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : null}

      {/* Текст кнопки */}
      <span className={isLoading ? "invisible" : (isBold) ? 'font-bold' : ''}>{children}</span>
    </button>
  );
};

export default Button;