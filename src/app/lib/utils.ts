export async function handleAsync<T, E = unknown>(
  promise: Promise<T>
): Promise<[T, null] | [null, E]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err as E];
  }
}