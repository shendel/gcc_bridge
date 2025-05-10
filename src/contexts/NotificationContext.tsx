import { createContext, useContext, useState, useEffect } from "react";
import NotificationToast from '@/components/NotificationToast'

// Создаем контекст для нотификаций
const NotificationContext = createContext({
  addNotification: () => {},
});

// Хук для доступа к контексту
export const useNotification = () => {
  return useContext(NotificationContext);
};

// Провайдер контекста
export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  let idCounter = 0;
  // Функция для добавления новой нотификации
  const addNotification = (type, message, link ,linkTitle) => {
    const id = `${Date.now()}_${new Date().getMilliseconds()}_${idCounter}`; // Генерируем уникальный ID
    idCounter++
    let timerId;

    const newNotification = {
      id,
      type,
      message,
      link,
      linkTitle,
      timerId, // Свойство для хранения ID таймера
    };

    // Добавляем новое уведомление
    setNotifications((prev) => [
      {
        ...newNotification,
        timerId: setTimeout(() => {
          removeNotification(id); // Удаляем уведомление после 5 секунд
        }, 5000),
      },
      ...prev,
    ]);
  };

  // Функция для удаления нотификации
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Очистка всех таймеров при обновлении состояния или размонтировании компонента
  useEffect(() => {
  /*
    return () => {
      console.log('>>> remove all timers')
      notifications.forEach(({ timerId }) => clearTimeout(timerId)); // Очищаем все таймеры
    };
    */
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationToast notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
}