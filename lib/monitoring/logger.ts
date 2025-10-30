/**
 * Logger Service
 * Centralized logging with different severity levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
  error?: Error
  userId?: string
  requestId?: string
}

export interface Logger {
  debug(message: string, context?: Record<string, any>): void
  info(message: string, context?: Record<string, any>): void
  warn(message: string, context?: Record<string, any>): void
  error(message: string, error?: Error, context?: Record<string, any>): void
  fatal(message: string, error?: Error, context?: Record<string, any>): void
}

class LoggerService implements Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(entry: LogEntry): void {
    const logData = {
      ...entry,
      timestamp: entry.timestamp.toISOString()
    }

    // Console output in development
    if (this.isDevelopment) {
      const color = this.getConsoleColor(entry.level)
      console.log(color, `[${entry.level.toUpperCase()}]`, entry.message, entry.context || '')
      if (entry.error) {
        console.error(entry.error)
      }
    }

    // In production, you might want to send to external service
    // Example: Sentry, DataDog, CloudWatch, etc.
    if (!this.isDevelopment) {
      // Send to logging service
      this.sendToLoggingService(logData)
    }
  }

  private getConsoleColor(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[35m'  // Magenta
    }
    return colors[level] || '\x1b[0m'
  }

  private sendToLoggingService(logData: any): void {
    // Implement external logging service integration
    // For now, just JSON stringify for production logs
    if (typeof window === 'undefined') {
      // Server-side only
      console.log(JSON.stringify(logData))
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      context
    })
  }

  info(message: string, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      context
    })
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      context
    })
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      error,
      context
    })
  }

  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log({
      level: LogLevel.FATAL,
      message,
      timestamp: new Date(),
      error,
      context
    })
  }
}

export const logger = new LoggerService()
