import { CronJob } from 'cron';
import path from 'path';
import { deleteOldLogs } from './logCleaner';

/**
 * Schedules a cron job to delete old logs every day at 3:00 AM.
 */
export const scheduleLogCleanup = () => {
  const logDirectory = path.join(__dirname, '../../log');

  const job = new CronJob(
    '0 3 * * *', // Cron schedule: Every day at 3:00 AM
    () => {
      console.log('🕒 Running scheduled log cleanup...');
      deleteOldLogs(logDirectory);
      console.log('✅ Log cleanup scheduled daily at 3:00 AM (UTC).');
    },
    null, // onComplete (optional cleanup callback, not needed here)
    true, // Start the job right after initialization
    'UTC' // Timezone
  );
};
