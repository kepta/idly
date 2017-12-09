declare module '*/data.json' {
  const dataDeprecated: any;
  export default dataDeprecated;
}

declare module '*/worker.worker' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export = WebpackWorker;
}
