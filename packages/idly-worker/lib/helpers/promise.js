export function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
export function cancelablePromise(promise) {
    let hasCanceled = false;
    const wrappedPromise = new Promise((resolve, reject) => promise
        .then((val) => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)))
        .catch(error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))));
    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled = true;
        }
    };
}
//# sourceMappingURL=promise.js.map