export function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function cancelablePromise<T>(promise: Promise<T>) {
  let hasCanceled_ = false;

  // promise.catch(e => console.log(e));
  const wrappedPromise: Promise<T> = new Promise((resolve, reject) =>
    promise
      .then(
        (val: T) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val))
      )
      .catch(
        error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
      )
  );
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
}
