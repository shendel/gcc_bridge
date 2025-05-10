import React, { useEffect, useState } from "react";

const Counter = ({ value, children, duration = 1000, start = 0}) => {
  if (!value && children) value = Number(children)
  const [currentValue, setCurrentValue] = useState(0);

  // Функция для расчета значения по экспоненте
  useEffect(() => {
    let start = 0;
    const ease = (t) => 1 - Math.exp(-4 * t); // Экспоненциальная функция замедления

    const timer = setInterval(() => {
      const progress = Date.now() - start;
      if (progress > duration) {
        clearInterval(timer);
        setCurrentValue(value); // Устанавливаем конечное значение
      } else {
        const animatedValue = Math.round(value * ease(progress / duration), 4);
        setCurrentValue(animatedValue);
      }
    }, 16); // Приблизительно 60 FPS

    start = Date.now(); // Запоминаем время начала анимации

    return () => clearInterval(timer); // Очищаем интервал при размонтировании
  }, [value]);

  return (
    <>
      {currentValue.toLocaleString()} {/* Отображаем текущее значение */}
    </>
  );
};

export default Counter;