import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст для модального окна
const ConfirmationModalContext = createContext({
  openModal: () => {},
  closeModal: () => {}
});

// Хук для доступа к контексту
export const useConfirmationModal = () => {
  return useContext(ConfirmationModalContext);
};

// Компонент модального окна
export default function ConfirmationModal({ children }) {
  const [modals, setModals] = useState([]); // Массив всех открытых окон

  // Функция для открытия модального окна
  const openModal = (options) => {
    const newModal = {
      id: options.id || Date.now(), // Уникальный ID для каждого окна
      title: options.title || "Confirm Action",
      description: options.description || "Are you sure?",
      okTitle: options.okTitle || "Confirm",
      cancelTitle: options.cancelTitle || "Cancel",
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
      isAlert: options.isAlert || false,
      content: options.content || null,
      hideBottomButtons: options.hideBottomButtons || false,
      hideCloseButton: options.hideCloseButton || false,
      fullWidth: options.fullWidth || false,
      onClose: options.onClose || false
    };
    setModals((prev) => [...prev, newModal]); // Добавляем новое окно в массив
  };

  // Функция для закрытия конкретного модального окна
  const closeModal = (id, callbacks = {}) => {
    const { doCancel, doConfirm, data = false } = callbacks;

    setModals((prev) =>
      prev.filter((modal) => {
        if (modal.id === id) {
          if (modal.onClose) modal.onClose(data)
          if (doConfirm && modal.onConfirm) modal.onConfirm(data);
          if (doCancel && modal.onCancel) modal.onCancel(data);
          return false; // Удаляем окно из массива
        }
        return true;
      })
    );
  };
  /*
  // Функция для закрытия модального окна
  const closeModal = (id, callbacks = {}) => {
    const { doCancel, doConfirm, data = false } = callbacks;

    setModals((prev) =>
      prev.filter((modal) => {
        if (modal.id === id) {
          if (doConfirm && modal.onConfirm) modal.onConfirm(data);
          if (doCancel && modal.onCancel) modal.onCancel(data);
          return false; // Удаляем окно из массива
        }
        return true;
      })
    );
  };
  */
  return (
    <ConfirmationModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Анимированный показ/скрытие модальных окон */}
      <AnimatePresence>
        {modals.map((modal) => (
          <motion.div
            key={modal.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`${((modal.fullWidth) ? 'overflow-y-auto' : 'items-center flex')} fixed inset-0 justify-center bg-black bg-opacity-50 z-50`}
          >
            {/* Основной контейнер модального окна */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-lg p-6 shadow-lg w-full ${(modal.fullWidth) ? 'max-w-4xl m-auto' : 'max-w-md'} relative`}
            >
              {/* Заголовок */}
              <h2 className="text-2xl font-bold text-center mb-4">{modal.title}</h2>

              {modal.content == null ? (
                <div className="text-gray-700 text-center mb-6">
                  {modal.description}
                </div>
              ) : (
                <div>{modal.content}</div>
              )}

              {!modal.hideBottomButtons && (
                <>
                  {modal.isAlert ? (
                    <div className="grid place-items-center">
                      <button
                        onClick={() => closeModal(modal.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        {modal.okTitle || "Ok"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => closeModal(modal.id, { doCancel: true })}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        {modal.cancelTitle || "Cancel"}
                      </button>
                      <button
                        onClick={() => closeModal(modal.id, { doConfirm: true })}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        {modal.okTitle || "Confirm"}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Кнопка закрытия */}
              {!modal.hideCloseButton && (
                <button
                  onClick={() => closeModal(modal.id)}
                  className="absolute top-2 right-2 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 hover:text-gray-700"
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
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ConfirmationModalContext.Provider>
  );
}