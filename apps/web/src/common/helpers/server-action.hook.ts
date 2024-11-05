import { useState, useCallback } from 'react';
import { getLogger } from '@web/lib/logger';

const logger = getLogger('useServerAction');

/**
 * Custom hook to handle server actions with loading state management.
 *
 * This hook provides a way to execute an asynchronous or synchronous action
 * with automatic handling of loading state and optional callback on completion.
 *
 * Naming Convention:
 * - Server action functions should have `Action` at the end of their name.
 * - The resulting function that manages the loading state should have `M` or `Managed` at the end of its name.
 *
 * @template P - Parameters type of the action function.
 * @template R - Return type of the action function.
 *
 * @param action - The action to be executed, which can be either synchronous or asynchronous.
 * @param onFinished - Optional callback to be invoked when the action is finished.
 *
 * @returns {[boolean, (...args: P) => Promise<R>]} - Returns a tuple:
 *  - `boolean`: Indicates whether the action is currently loading.
 *  - `(...args: P) => Promise<R>`: Function to execute the action.
 *
 * @example
 * const getDataAction = async (data) => {
 *   const response = await fetchData(data);
 *   return response;
 * };
 *
 * const onFinished = (result) => {
 *   console.log('Action finished with result:', result);
 * };
 *
 * const [getDataActionPending, getDataActionM] = useServerAction(getDataAction, onFinished);
 *
 * useEffect(() => {
 *   getDataActionM(someData);
 * }, [someData]);
 */
export const useServerAction = <P extends any[], R>(
  action: (...args: P) => R | Promise<R>,
  onFinished?: (result: R) => void,
): [boolean, (...args: P) => Promise<R>] => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const runActionM = useCallback(
    async (...args: P): Promise<R> => {
      setSubmitLoading(true);
      try {
        const result = action(...args);
        if (result instanceof Promise) {
          const resolvedResult = await result;
          if (onFinished) onFinished(resolvedResult);
          return resolvedResult;
        }
        if (onFinished) onFinished(result);
        return result;
      } catch (err) {
        logger.error({ err }, 'Error during server action execution');
        throw err;
      } finally {
        setSubmitLoading(false);
      }
    },
    [action, onFinished],
  );

  return [submitLoading, runActionM];
};

/* Version with usage of useTransition if i ever need it */

// export const useServerAction = <P extends any[], R>(
//     action: (...args: P) => Promise<R>,
//     onFinished?: (_: R | undefined) => void,
//   ): [boolean, (...args: P) => Promise<R | undefined>] => {
//     const [isPending, startTransition] = useTransition();
//     const [result, setResult] = useState<R>();
//     const [finished, setFinished] = useState(false);
//     const resolver = useRef<(value?: R | PromiseLike<R>) => void>();

//     useEffect(() => {
//       if (!finished) return;

//       if (onFinished) onFinished(result);
//       resolver.current?.(result);
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [result, finished]);

//     const runAction = async (...args: P): Promise<R | undefined> => {
//       // Spread args here
//       startTransition(async () => {
//         const data = await action(...args);
//         setResult(data);
//         setFinished(true);
//       });

//       return new Promise((resolve) => {
//         resolver.current = resolve;
//       });
//     };

//     return [isPending, runAction];
//   };
