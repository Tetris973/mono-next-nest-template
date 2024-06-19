import { useToast, UseToastOptions, ToastId } from '@chakra-ui/react';
import { useRef } from 'react';

const useCustomToast = () => {
  const toast = useToast();
  const toastIds = useRef<ToastId[]>([]);

  const showToast = (options: UseToastOptions) => {
    if (toastIds.current.length >= 3) {
      const oldestToastId = toastIds.current.shift();
      if (oldestToastId) {
        toast.close(oldestToastId);
      }
    }

    const id = toast({
      duration: 5000,
      isClosable: true,
      ...options,
    });

    if (id) {
      toastIds.current.push(id);
    }
  };

  const closeAllToasts = () => {
    toast.closeAll();
    toastIds.current = [];
  };

  return {
    toastSuccess: (description: string) => showToast({ title: 'Success', description, status: 'success' }),
    toastError: (description: string) => showToast({ title: 'Error', description, status: 'error' }),
    toastInfo: (description: string) => showToast({ title: 'Info', description, status: 'info' }),
    toastWarning: (description: string) => showToast({ title: 'Warning', description, status: 'warning' }),
    closeAllToasts,
  };
};

export { useCustomToast };
