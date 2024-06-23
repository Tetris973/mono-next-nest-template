import { useState, useCallback } from 'react';

export const useServerAction = <P extends any[], R>(
  action: (...args: P) => Promise<R>,
  onFinished?: (result: R) => void,
): [boolean, (...args: P) => Promise<R>] => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const runAction = useCallback(
    async (...args: P): Promise<R> => {
      setSubmitLoading(true);
      try {
        const result = await action(...args);
        if (onFinished) onFinished(result);
        return result;
      } catch (error) {
        console.error('Error during action execution:', error);
        throw error;
      } finally {
        setSubmitLoading(false);
      }
    },
    [action, onFinished],
  );

  return [submitLoading, runAction];
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
