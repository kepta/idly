const win: any = window;

win.requestIdleCallback =
  win.requestIdleCallback ||
  function(cb) {
    const start = Date.now();
    return setTimeout(function() {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

win.cancelIdleCallback =
  win.cancelIdleCallback ||
  function(id) {
    clearTimeout(id);
  };
