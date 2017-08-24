export function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function cancelablePromise<T>(promise: Promise<T>) {
  let hasCanceled = false;

  const wrappedPromise: Promise<T> = new Promise((resolve, reject) =>
    promise
      .then(
        (val: T) => (hasCanceled ? reject({ isCanceled: true }) : resolve(val))
      )
      .catch(
        error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
      )
  );
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    }
  };
}
