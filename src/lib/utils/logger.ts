const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private logLevel: number = LOG_LEVELS.INFO;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = LOG_LEVELS[level];
  }

  error(message: string, data?: any) {
    this.log('ERROR', message, data);
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  debug(message: string, data?: any) {
    this.log('DEBUG', message, data);
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (LOG_LEVELS[level] <= this.logLevel) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data: this.sanitize(data)
      };
      this.logs.push(entry);
      
      if (import.meta.env.DEV) {
        console.log(`[${entry.timestamp}] ${level}: ${message}`, data ? data : '');
      }
    }
  }

  private sanitize(data: any): any {
    if (!data) return undefined;
    
    // Remove sensitive information
    const sensitiveKeys = ['apiKey', 'password', 'token', 'secret'];
    if (typeof data === 'object') {
      return Object.keys(data).reduce((acc, key) => {
        if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
          acc[key] = '[REDACTED]';
        } else {
          acc[key] = this.sanitize(data[key]);
        }
        return acc;
      }, {} as any);
    }
    return data;
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 