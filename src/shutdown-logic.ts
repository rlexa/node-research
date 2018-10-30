async function shutdown(error: any, waitFunc: () => void) {
  console.log('shutting down...');

  if (typeof waitFunc === 'function') {
    try {
      console.log('...wait for cleanup...');
      await waitFunc();
    } catch (ex) {
      console.error('Cleanup exception', ex);
      error = error || ex;
    }
  }

  console.log('...exiting process...');
  process.exit(!error ? 0 : 1);
}

export function registerShutdown(waitFunc: () => Promise<any>) {
  process.on('SIGTERM', () => {
    console.log('...detected: SIGTERM');
    shutdown(null, waitFunc);
  });

  process.on('SIGINT', () => {
    console.log('...detected: SIGINT');
    shutdown(null, waitFunc);
  });

  process.on('uncaughtException', error => {
    console.log('...detected: uncaught exception');
    console.error(error);
    shutdown(error, waitFunc);
  });
}
