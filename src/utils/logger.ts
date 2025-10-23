/**
 * =============================================================================
 * LOGGER UTILITY - COMPREHENSIVE LOGGING SOLUTION
 * =============================================================================
 *
 * Centralized logging utility for the Labyrinth collaboration platform.
 * Provides structured logging with different levels and formatting.
 *
 * =============================================================================
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

export const LOG_LEVELS = {
  ERROR: 'error' as const,
  WARN: 'warn' as const,
  INFO: 'info' as const,
  HTTP: 'http' as const,
  DEBUG: 'debug' as const,
};

export interface LogData {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  error?: Error;
  userId?: string;
  requestId?: string;
  service?: string;
}

// Type guard for error objects
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'labyrinth-backend') {
    this.serviceName = serviceName;
  }

  private formatLog(level: LogLevel, message: string, data?: any): LogData {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      ...(data && { data }),
    };
  }

  private output(logData: LogData): void {
    // In production, you might want to use a proper logging library like Winston
    // For now, we'll use console methods with structured output
    const logString = JSON.stringify(logData, null, 2);
    
    switch (logData.level) {
      case LOG_LEVELS.ERROR:
        console.error(logString);
        break;
      case LOG_LEVELS.WARN:
        console.warn(logString);
        break;
      case LOG_LEVELS.INFO:
        console.info(logString);
        break;
      case LOG_LEVELS.HTTP:
        console.log(logString);
        break;
      case LOG_LEVELS.DEBUG:
        console.debug(logString);
        break;
      default:
        console.log(logString);
    }
  }

  error(message: string, error?: Error, data?: any): void {
    const logData = this.formatLog(LOG_LEVELS.ERROR, message, data);
    if (error) {
      logData.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } as any;
    }
    this.output(logData);
  }

  warn(message: string, data?: any): void {
    const logData = this.formatLog(LOG_LEVELS.WARN, message, data);
    this.output(logData);
  }

  info(message: string, data?: any): void {
    const logData = this.formatLog(LOG_LEVELS.INFO, message, data);
    this.output(logData);
  }

  http(message: string, data?: any): void {
    const logData = this.formatLog(LOG_LEVELS.HTTP, message, data);
    this.output(logData);
  }

  debug(message: string, data?: any): void {
    const logData = this.formatLog(LOG_LEVELS.DEBUG, message, data);
    this.output(logData);
  }

  // Convenience methods for common use cases
  controllerStart(controllerName: string, method: string, userId?: string): void {
    this.info(`Controller started: ${controllerName}.${method}`, {
      controller: controllerName,
      method,
      userId,
    });
  }

  controllerEnd(controllerName: string, method: string, userId?: string): void {
    this.info(`Controller completed: ${controllerName}.${method}`, {
      controller: controllerName,
      method,
      userId,
    });
  }

  serviceStart(serviceName: string, method: string, userId?: string): void {
    this.info(`Service started: ${serviceName}.${method}`, {
      service: serviceName,
      method,
      userId,
    });
  }

  serviceEnd(serviceName: string, method: string, userId?: string): void {
    this.info(`Service completed: ${serviceName}.${method}`, {
      service: serviceName,
      method,
      userId,
    });
  }

  databaseQuery(query: string, params?: any, duration?: number): void {
    this.debug('Database query executed', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      params,
      duration,
    });
  }

  authEvent(event: string, userId?: string, ip?: string): void {
    this.info(`Auth event: ${event}`, {
      event,
      userId,
      ip,
    });
  }

  securityEvent(event: string, severity: 'low' | 'medium' | 'high', data?: any): void {
    this.warn(`Security event: ${event}`, {
      event,
      severity,
      ...data,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for creating new instances if needed
export { Logger };