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
  process.once('SIGINT', () => {
    console.log('...detected: SIGINT');
    shutdown(null, waitFunc);
  });

  process.once('SIGTERM', () => {
    console.log('...detected: SIGTERM');
    shutdown(null, waitFunc);
  });

  process.once('SIGUSR2', () => {
    console.log('...detected: SIGUSR2');
    shutdown(null, waitFunc);
    process.kill(process.pid, 'SIGUSR2');
  });

  process.once('uncaughtException', error => {
    console.log('...detected: uncaught exception');
    console.error(error);
    shutdown(error, waitFunc);
  });
}
