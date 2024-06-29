import { useToast, UseToastOptions } from '@chakra-ui/react';
import { useCallback } from 'react';

export interface ToastUtils {
  toastSuccess: (description: string) => void;
  toastError: (description: string) => void;
  toastInfo: (description: string) => void;
  toastWarning: (description: string) => void;
  closeAllToasts: () => void;
}

const useCustomToast = (): ToastUtils => {
  const toast = useToast();

  // Memoize: useCallback is used to prevent unnecessary re-renders
  const showToast = useCallback(
    (options: UseToastOptions) => {
      toast({
        duration: 5000,
        isClosable: true,
        ...options,
      });
    },
    [toast],
  );

  // Memoize: useCallback is used to prevent unnecessary re-renders
  const closeAllToasts = useCallback(() => {
    toast.closeAll();
  }, [toast]);

  return {
    toastSuccess: useCallback(
      (description: string) => showToast({ title: 'Success', description, status: 'success' }),
      [showToast],
    ),
    toastError: useCallback(
      (description: string) => showToast({ title: 'Error', description, status: 'error' }),
      [showToast],
    ),
    toastInfo: useCallback(
      (description: string) => showToast({ title: 'Info', description, status: 'info' }),
      [showToast],
    ),
    toastWarning: useCallback(
      (description: string) => showToast({ title: 'Warning', description, status: 'warning' }),
      [showToast],
    ),
    closeAllToasts,
  };
};

export { useCustomToast };
