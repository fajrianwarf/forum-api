type LogLevel = 'info' | 'warn' | 'error' | 'debug';

type LogMeta = Record<string, unknown>;

const serializeError = (error: unknown): LogMeta | undefined => {
  if (!(error instanceof Error)) {
    return undefined;
  }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
};

class Logger {
  private static log(level: LogLevel, message: string, meta: LogMeta = {}): void {
    if (process.env.NODE_ENV === 'test' && process.env.ENABLE_TEST_LOGS !== 'true') {
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };

    const line = JSON.stringify(payload);

    if (level === 'error') {
      console.error(line);
      return;
    }

    if (level === 'warn') {
      console.warn(line);
      return;
    }

    console.log(line);
  }

  static info(message: string, meta?: LogMeta): void {
    Logger.log('info', message, meta);
  }

  static warn(message: string, meta?: LogMeta): void {
    Logger.log('warn', message, meta);
  }

  static error(message: string, error?: unknown, meta: LogMeta = {}): void {
    Logger.log('error', message, {
      ...meta,
      error: serializeError(error),
    });
  }
}

export default Logger;
