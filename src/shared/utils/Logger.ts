import * as fs from 'fs';
import * as path from 'path';

export default class Logger {
  private static async logToFile(message: string): Promise<void> {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    const logFilePath = path.join(__dirname, 'app.log');

    try {
      // Ghi log vào tệp không đồng bộ
      await fs.promises.appendFile(logFilePath, logMessage, 'utf8');
    } catch (error) {
      console.error('Error writing to log file', error);
    }
  }

  private static formatMessage(message: string, level: string): string {
    return `[${level}] ${message}`;
  }

  static log(message: string): void {
    const formattedMessage = this.formatMessage(message, 'LOG');
    console.log(formattedMessage);
    this.logToFile(formattedMessage);
  }

  static error(message: string): void {
    const formattedMessage = this.formatMessage(message, 'ERROR');
    console.error(formattedMessage);
    this.logToFile(formattedMessage);
  }

  static info(message: string): void {
    const formattedMessage = this.formatMessage(message, 'INFO');
    console.info(formattedMessage);
    this.logToFile(formattedMessage);
  }

  static warn(message: string): void {
    const formattedMessage = this.formatMessage(message, 'WARN');
    console.warn(formattedMessage);
    this.logToFile(formattedMessage);
  }

  static debug(message: string): void {
    const formattedMessage = this.formatMessage(message, 'DEBUG');
    console.debug(formattedMessage);
    this.logToFile(formattedMessage);
  }
}
