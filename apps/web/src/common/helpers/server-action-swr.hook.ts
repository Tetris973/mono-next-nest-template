import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { ServerActionResponse, ServerActionError } from '@web/common/types/action-response.type';

/**
 * Adapts a server action returning ServerActionResponse for use with SWR.
 *
 * This function wraps server actions to format their responses for SWR compatibility:
 * - On success, it returns the `data` property directly.
 * - On error, it throws a `ServerActionError` for SWR to catch and expose.
 *
 * @template T The type of the successful response data.
 * @template E The type of additional error details (optional).
 *
 * @param action A function that returns a Promise<ServerActionResponse<T, E>>.
 * @returns A Promise that resolves to the data of type T.
 * @throws {ServerActionError<E>} If the server action returns an error response.
 *         The error includes status, message, and optional details from the original response.
 *
 * @example
 * const { data, error } = useSWR('key', () => serverActionFetcher(() => myServerAction(param)));
 */
export async function serverActionFetcher<T, E = undefined>(
  action: () => Promise<ServerActionResponse<T, E>>,
): Promise<T> {
  const { data, error } = await action();
  if (error) {
    throw new ServerActionError<E>(error.status, error.message, data);
  }
  return data;
}

/**
 * Extends the SWR hook to seamlessly support server actions returning ServerActionResponse.
 *
 * This custom hook:
 * - Integrates serverActionFetcher with SWR, handling the conversion of ServerActionResponse
 *   to the format expected by SWR.
 * - Ensures that the 'data' in the SWR response is of type T, and 'error' is of type ServerActionError<E>,
 *   matching the types from ServerActionResponse<T, E>.
 * - Accepts all standard SWR configuration options via the config parameter, passing them
 *   directly to the underlying useSWR call.
 *
 * @template T The type of the successful response data.
 * @template E The type of additional error details (optional).
 *
 * @param key The unique key for the SWR cache. Passthrough, see SWR for usage.
 * @param action A function that returns a Promise<ServerActionResponse<T, E>>.
 * @param config Optional SWR configuration object.
 * @returns An SWRResponse object where data is of type T and error is of type ServerActionError<E>.
 *
 * @example
 * const { data: user, error, isLoading } = useServerActionSWR(
 *   `getUserById/${userId}`,
 *   () => getUserByIdAction(userId)
 * );
 */
export function useServerActionSWR<T, E = undefined>(
  key: string | null,
  action: () => Promise<ServerActionResponse<T, E>>,
  config?: SWRConfiguration<T, ServerActionError<E>>,
): SWRResponse<T, ServerActionError<E>> {
  return useSWR<T, ServerActionError<E>>(key, () => serverActionFetcher(action), config);
}
