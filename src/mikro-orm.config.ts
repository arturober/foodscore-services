import { ConnectionOptions } from '@mikro-orm/core';
import { MariaDbDriver } from '@mikro-orm/mariadb';

export default {
  entities: ['dist/entities'], // compiled JS files
  entitiesTs: ['src/entities'],
  dbName: 'foodscore',
  driver: MariaDbDriver,
  driverOptions: { connection: { timezone: '+02:00' } },    
  user: 'root',
  password: '',
  port: 3306,
  host: 'localhost',
  debug: true,
} as ConnectionOptions;
