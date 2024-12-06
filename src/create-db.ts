import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
// import { LoggerFactory } from './LoggerFactory';

export async function ensureDatabaseExists(options: DataSourceOptions) {
  const { database, ...connectionOptions } = options;
  //   const logger = LoggerFactory('MyApp');

  if (!database) {
    throw new Error('Database name must be specified.');
  }

  const tempDataSource = new DataSource({
    ...connectionOptions,
    database: undefined, // Exclude specific database
  });

  try {
    await tempDataSource.initialize();
    Logger.warn('Connected successfully to the database server.');

    const checkQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
    const createQuery = `CREATE DATABASE "${database}"`;

    const result = await tempDataSource.query(checkQuery, [database]);
    if (result.length === 0) {
      Logger.warn(`Database "${database}" does not exist. Creating...`);
      await tempDataSource.query(createQuery);
      Logger.log(`Database "${database}" created successfully.`);
    } else {
      Logger.log(`Database "${database}" already exists.`);
    }
  } catch (error) {
    Logger.error('Error creating database:', error.message);
    throw error;
  } finally {
    await tempDataSource.destroy();
  }
}
