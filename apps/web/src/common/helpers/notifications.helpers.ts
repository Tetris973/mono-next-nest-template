import { NotificationData, showNotification, NotificationsStore } from '@mantine/notifications';

/**
 * Re-export everything from Mantine notifications so that every notification related module is imported from this single file
 */
export * from '@mantine/notifications';

/**
 * Default timeout for notifications in milliseconds.
 */
export const DEFAULT_NOTIFICATION_TIMEOUT = 5000;

/**
 * Defines the possible variants for notifications.
 */
export type NotificationVariant = 'success' | 'error' | 'info' | 'warning';

/**
 * Extends Mantine's NotificationProps to include our custom properties.
 * This allows for type-safe usage of our custom notification function while maintaining
 * compatibility with Mantine's properties.
 */
export type CustomNotificationProps = Omit<NotificationData, 'color'> & {
  variant?: NotificationVariant;
};

/**
 * Maps notification variants to their corresponding colors.
 * This function centralizes the color logic.
 */
const getColorByVariant = (variant: NotificationVariant): string => {
  switch (variant) {
    case 'success':
      return 'green';
    case 'error':
      return 'red';
    case 'info':
      return 'blue';
    case 'warning':
      return 'yellow';
  }
};

/**
 * Shows a custom notification with some defaults parameter that should be used in the app.
 * This method still provides full customization options from Mantine.
 */
export const showCustomNotification = (
  { variant = 'info', message, ...props }: CustomNotificationProps,
  store?: NotificationsStore,
): string => {
  return showNotification(
    {
      color: getColorByVariant(variant),
      autoClose: DEFAULT_NOTIFICATION_TIMEOUT,
      withCloseButton: true,
      message, // Explicitly include the message property
      ...props,
    },
    store,
  );
};

/**
 * Convenience functions for showing specific types of notifications.
 * These functions provide a simpler API for common use cases.
 */
export const showSuccessNotification = (
  { title = 'Success', ...props }: Omit<CustomNotificationProps, 'variant'>,
  store?: NotificationsStore,
) => showCustomNotification({ ...props, title, variant: 'success' }, store);

export const showErrorNotification = (
  { title = 'Error', ...props }: Omit<CustomNotificationProps, 'variant'>,
  store?: NotificationsStore,
) => showCustomNotification({ ...props, title, variant: 'error' }, store);

export const showInfoNotification = (
  { title = 'Info', ...props }: Omit<CustomNotificationProps, 'variant'>,
  store?: NotificationsStore,
) => showCustomNotification({ ...props, title, variant: 'info' }, store);

export const showWarningNotification = (
  { title = 'Warning', ...props }: Omit<CustomNotificationProps, 'variant'>,
  store?: NotificationsStore,
) => showCustomNotification({ ...props, title, variant: 'warning' }, store);
