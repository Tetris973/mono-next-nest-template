import { useToast, UseToastOptions } from '@chakra-ui/react';

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (options: UseToastOptions) => {
    toast({
      duration: 5000,
      isClosable: true,
      ...options,
    });
  };

  const closeAllToasts = () => {
    toast.closeAll();
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
