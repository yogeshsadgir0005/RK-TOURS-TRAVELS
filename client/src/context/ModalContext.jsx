import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiXCircle, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning', // 'warning', 'danger', 'info', 'success'
    onConfirm: null,
    onCancel: null,
  });

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure you want to proceed?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'warning',
        onConfirm: () => {
          setModalState(s => ({ ...s, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(s => ({ ...s, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const getIcon = () => {
    switch(modalState.type) {
      case 'danger': return <FiXCircle className="text-3xl text-red-500" />;
      case 'success': return <FiCheckCircle className="text-3xl text-green-500" />;
      case 'info': return <FiInfo className="text-3xl text-blue-500" />;
      case 'warning': default: return <FiAlertCircle className="text-3xl text-orange-500" />;
    }
  };

  const getIconBg = () => {
    switch(modalState.type) {
      case 'danger': return 'bg-red-50 border-red-100';
      case 'success': return 'bg-green-50 border-green-100';
      case 'info': return 'bg-blue-50 border-blue-100';
      case 'warning': default: return 'bg-orange-50 border-orange-100';
    }
  };

  const getConfirmBtnColor = () => {
    switch(modalState.type) {
      case 'danger': return 'bg-red-500 hover:bg-red-600 shadow-red-500/25 text-white';
      case 'success': return 'bg-green-500 hover:bg-green-600 shadow-green-500/25 text-white';
      case 'info': return 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25 text-white';
      case 'warning': default: return 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 text-white';
    }
  };

  return (
    <ModalContext.Provider value={{ showConfirm }}>
      {children}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={modalState.onCancel}
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${getIconBg()}`}>
                {getIcon()}
              </div>
              <h3 className="text-xl font-black text-black mb-2">{modalState.title}</h3>
              <p className="text-sm font-medium text-gray-500 mb-8">{modalState.message}</p>
              <div className="flex gap-3">
                <button 
                  onClick={modalState.onCancel}
                  className="flex-1 h-12 bg-gray-50 hover:bg-gray-100 text-black font-bold text-sm rounded-xl border border-gray-200 transition-colors"
                >
                  {modalState.cancelText}
                </button>
                <button 
                  onClick={modalState.onConfirm}
                  className={`flex-1 h-12 font-bold text-sm rounded-xl shadow-lg transition-colors ${getConfirmBtnColor()}`}
                >
                  {modalState.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};
