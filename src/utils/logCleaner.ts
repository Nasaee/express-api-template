import fs from 'fs';
import path from 'path';
import moment from 'moment';

/**
 * Deletes log files older than a specified number of months.
 * @param directory - The directory where logs are stored.
 * @param months - The number of months to retain logs.
 */
export const deleteOldLogs = (directory: string, months: number = 3) => {
  try {
    const now = moment(); // Current time using moment
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        // Get file creation or modification time
        const fileDate = moment(stats.birthtime); // Or use `stats.mtime` for modification time
        const ageInMonths = now.diff(fileDate, 'months');

        if (ageInMonths > months) {
          fs.unlinkSync(filePath);
          console.log(
            `🗑️ Deleted old log file: ${file} (Age: ${ageInMonths} months)`
          );
        }
      }
    });

    console.log('✅ Log cleanup completed successfully.');
  } catch (error) {
    console.error('❌ Failed to clean old log files:', error);
  }
};
