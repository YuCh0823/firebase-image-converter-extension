import { Logger } from '../../src/utils/logger';
import * as functions from 'firebase-functions';

describe('Logger', () => {
  let logger: Logger;
  const context = 'TestContext';

  beforeEach(() => {
    logger = new Logger(context);
    // 清除所有模拟的调用记录
    jest.clearAllMocks();
  });

  describe('info', () => {
    it('should log info message with context', () => {
      const message = 'Test info message';
      const data = { key: 'value' };

      logger.info(message, data);

      expect(functions.logger.info).toHaveBeenCalledWith(message, {
        context,
        ...data,
      });
    });

    it('should handle undefined data', () => {
      const message = 'Test info message';

      logger.info(message);

      expect(functions.logger.info).toHaveBeenCalledWith(message, {
        context,
      });
    });
  });

  describe('error', () => {
    it('should log error message with Error object', () => {
      const message = 'Test error message';
      const error = new Error('Test error');

      logger.error(message, error);

      expect(functions.logger.error).toHaveBeenCalledWith(message, {
        context,
        error: error.message,
        stack: error.stack,
      });
    });

    it('should handle non-Error objects', () => {
      const message = 'Test error message';
      const error = 'Simple error string';

      logger.error(message, error);

      expect(functions.logger.error).toHaveBeenCalledWith(message, {
        context,
        error: 'Simple error string',
      });
    });
  });

  describe('warn', () => {
    it('should log warning message with data', () => {
      const message = 'Test warning message';
      const data = { warning: 'test' };

      logger.warn(message, data);

      expect(functions.logger.warn).toHaveBeenCalledWith(message, {
        context,
        ...data,
      });
    });
  });

  describe('debug', () => {
    it('should log debug message with data', () => {
      const message = 'Test debug message';
      const data = { debug: 'test' };

      logger.debug(message, data);

      expect(functions.logger.debug).toHaveBeenCalledWith(message, {
        context,
        ...data,
      });
    });
  });
});
