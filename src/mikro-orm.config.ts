import { ConnectionOptions } from '@mikro-orm/core';
import { MariaDbDriver } from '@mikro-orm/mariadb';

export default {
  entities: ['dist/entities'], // compiled JS files
  entitiesTs: ['src/entities'],
  dbName: 'foodscore',
  driver: MariaDbDriver,
  driverOptions: { connection: { timezone: '+02:00' } },
  user: process.env.DB_USERNAME || 'example',
  password: process.env.DB_PASSWORD || 'example',
  port: parseInt(process.env.DB_SERVER_PORT, 10) || 3306,
  host: process.env.DB_SERVER_HOST || 'localhost',
  debug: true,
} as ConnectionOptions;
