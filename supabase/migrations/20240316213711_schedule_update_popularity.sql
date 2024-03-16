CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('0 0 * * 0', 'SELECT update_book_counts()', 'Update book counts');
