import { toast } from 'react-hot-toast';

const useToast = () => {
  const dismissPreviousToasts = () => {
    toast.dismiss(); // Dismiss all open toasts
  };

  const showSuccess = (message) => {
    dismissPreviousToasts()
    toast.success(message, {
      duration: 2000,
      position: window.innerWidth <= 768 ? 'top-center' : 'top-right',
      style: {
        borderRadius: '1rem',
        background: '#fff',
        color: '#000',
      },
    });
  };

  const showError = (message) => {
    dismissPreviousToasts()
    toast.error(message, {
      duration: 2000,
      position: window.innerWidth <= 768 ? 'top-center' : 'top-right',
      style: {
        borderRadius: '10px',
        background: '#F44336',
        color: '#fff',
      },
    });
  };

  const showInfo = (message) => {
    dismissPreviousToasts()
    toast(message, {
      duration: 2000,
      position: window.innerWidth <= 768 ? 'bottom-center' : 'top-right',
      style: {
        borderRadius: '10px',
        background: '#2196F3',
        color: '#fff',
      },
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};

export default useToast;
