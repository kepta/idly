export declare function handleErrors(response: Response): Response;
export declare function cancelablePromise<T>(promise: Promise<T>): {
    promise: Promise<T>;
    cancel(): void;
};
