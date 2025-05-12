import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  type: "info" | "success" | "error";
  message: string;
  link?: string;
  timerId?: ReturnType<typeof setTimeout>; // Тип для ID таймера
}

interface NotificationToastProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const NotificationToast = ({ notifications, removeNotification }: NotificationToastProps) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-between px-4 py-2 rounded-md shadow-md max-w-sm w-full cursor-pointer ${
              notification.type === "info"
                ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                : notification.type === "success"
                ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            }`}
            onMouseEnter={() => {
              console.log('>>> Toast - remove timer')
              if (notification.timerId) clearTimeout(notification.timerId); // Останавливаем таймер при наведении
            }}
            onMouseLeave={() => {
              console.log('>>> Toast - create timer')
              // Создаем новый таймер при убирании курсора
              const newTimerId = setTimeout(() => {
                removeNotification(notification.id); // Удаляем уведомление после 5 секунд
              }, 10000);

              // Сохраняем новый таймер в объекте уведомления
              notification.timerId = newTimerId;

              // Возвращаем функцию очистки таймера
              return () => clearTimeout(newTimerId);
            }}
          >
            {/* Иконка */}
            {notification.type === "info" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
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
            )}
            {notification.type === "success" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {notification.type === "error" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2H6m4 4v6"
                />
              </svg>
            )}

            {/* Сообщение */}
            <p className="text-sm">{notification.message}</p>

            {/* Действие или ссылка */}
            {notification.link && (
              <a
                href={notification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold hover:underline pl-2"
              >
                {notification.linkTitle || `View Details`}
              </a>
            )}

            {/* Кнопка закрытия */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="focus:outline-none ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;