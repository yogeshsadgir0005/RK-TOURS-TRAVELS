/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiXCircle, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const ModalContext = createContext();
const MotionButton = motion.button;
const MotionDiv = motion.div;

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
    onConfirm: null,
    onCancel: null,
  });

  const showConfirm = useCallback((options) => new Promise((resolve) => {
    setModalState({
      isOpen: true,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you want to proceed?',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      type: options.type || 'warning',
      onConfirm: () => {
        setModalState((state) => ({ ...state, isOpen: false }));
        resolve(true);
      },
      onCancel: () => {
        setModalState((state) => ({ ...state, isOpen: false }));
        resolve(false);
      },
    });
  }), []);

  const iconStyles = {
    danger: ['text-red-400', 'bg-red-500/10 border-red-500/20'],
    success: ['text-emerald-400', 'bg-emerald-500/10 border-emerald-500/20'],
    info: ['text-orange-400', 'bg-orange-500/10 border-orange-500/20'],
    warning: ['text-orange-400', 'bg-orange-500/10 border-orange-500/20'],
  };
  const [iconColor, iconBackground] = iconStyles[modalState.type] || iconStyles.warning;
  const Icon = modalState.type === 'danger'
    ? FiXCircle
    : modalState.type === 'success'
      ? FiCheckCircle
      : modalState.type === 'info'
        ? FiInfo
        : FiAlertCircle;
  const confirmClass = modalState.type === 'danger'
    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
    : modalState.type === 'success'
      ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
      : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20';

  return (
    <ModalContext.Provider value={{ showConfirm }}>
      {children}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <MotionButton
              type="button"
              aria-label="Close dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={modalState.onCancel}
            />
            <MotionDiv
              role="dialog"
              aria-modal="true"
              aria-labelledby="rk-modal-title"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-sm rounded-[28px] border border-white/10 bg-neutral-900 p-6 text-center shadow-2xl"
            >
              <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${iconBackground}`}>
                <Icon className={`text-3xl ${iconColor}`} />
              </div>
              <h3 id="rk-modal-title" className="mb-2 text-xl font-black text-white">{modalState.title}</h3>
              <p className="mb-8 text-sm font-medium leading-relaxed text-gray-400">{modalState.message}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={modalState.onCancel}
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-neutral-800 text-sm font-bold text-white transition-colors hover:bg-neutral-700"
                >
                  {modalState.cancelText}
                </button>
                <button
                  type="button"
                  onClick={modalState.onConfirm}
                  className={`h-12 flex-1 rounded-xl text-sm font-bold text-white shadow-lg transition-colors ${confirmClass}`}
                >
                  {modalState.confirmText}
                </button>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};