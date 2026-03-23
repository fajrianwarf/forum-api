import { Pool } from 'pg';
import config from '../../config';
const testConfig = {
  host: config.testDatabase.host,
  port: config.testDatabase.port,
  user: config.testDatabase.user,
  password: config.testDatabase.password,
  database: config.testDatabase.database,
};

const runtimeConfig = {
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
};

const pool = config.environment === 'test' ? new Pool(testConfig) : new Pool(runtimeConfig);

export default pool;
