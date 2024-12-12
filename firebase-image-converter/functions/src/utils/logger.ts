import * as functions from 'firebase-functions';

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, data?: any): void {
    functions.logger.info(message, {
      context: this.context,
      ...data,
    });
  }

  error(message: string, error?: Error | any): void {
    functions.logger.error(message, {
      context: this.context,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  warn(message: string, data?: any): void {
    functions.logger.warn(message, {
      context: this.context,
      ...data,
    });
  }

  debug(message: string, data?: any): void {
    functions.logger.debug(message, {
      context: this.context,
      ...data,
    });
  }
}
