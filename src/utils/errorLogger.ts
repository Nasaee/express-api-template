import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Promisify file system methods
const mkdirAsync = promisify(fs.mkdir);
const appendFileAsync = promisify(fs.appendFile);

/**
 * Get the current date in YYYY-MM-DD format for log file naming.
 * @returns Formatted date string.
 */
const getLogFileName = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure two digits
  const day = String(now.getDate()).padStart(2, '0'); // Ensure two digits
  return `${year}-${month}-${day}.log`;
};

/**
 * Logs an error message to a file with proper formatting and timestamp.
 * @param message - The error message to log.
 */
const logErrorToFile = async (message: string) => {
  try {
    const logDir = path.join(__dirname, '../../log');
    await mkdirAsync(logDir, { recursive: true });

    const logFile = path.join(logDir, getLogFileName());

    const timestamp = new Date().toISOString();
    await appendFileAsync(logFile, `[${timestamp}] ${message}\n`);
  } catch (fileError) {
    console.error('Failed to write error log:', fileError);
  }
};

/**
 * Handles uncaught exceptions.
 */
export const handleUncaughtExceptions = () => {
  process.on('uncaughtException', async (err) => {
    const errorMessage = `🔥 Uncaught Exception: ${err.stack || err.message}`;
    console.error(errorMessage);

    await logErrorToFile(errorMessage);

    process.exit(1); // Force shutdown after logging
  });
};

/**
 * Handles unhandled promise rejections.
 */
export const handleUnhandledRejections = () => {
  process.on('unhandledRejection', async (reason, promise) => {
    const errorMessage = `🔥 Unhandled Rejection at: ${promise}, reason: ${
      reason instanceof Error ? reason.stack : reason
    }`;
    console.error(errorMessage);

    await logErrorToFile(errorMessage);

    process.exit(1); // Force shutdown after logging
  });
};
