export function cancelablePromise<T>(promise: Promise<T>) {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)))
      .catch(
        error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
      );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    }
  };
}

export function reqCancelableIdleCb(timeout) {
  return cancelablePromise(
    new Promise((res, rej) => {
      (window as any).requestIdleCallback(res, timeout && { timeout });
    })
  );
}
