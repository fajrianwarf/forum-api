import dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface AppConfig {
  environment: string;
  server: {
    host: string;
    port: number;
  };
  auth: {
    accessTokenKey: string;
    refreshTokenKey: string;
    accessTokenAge: number;
  };
  database: DatabaseConfig;
  testDatabase: DatabaseConfig;
}

const environment = process.env.NODE_ENV ?? 'development';
const isTestEnvironment = environment === 'test';

const requireEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const requireNumber = (key: string, fallback?: number): number => {
  const value = process.env[key];

  if (!value) {
    if (typeof fallback === 'number') {
      return fallback;
    }

    throw new Error(`Missing required environment variable: ${key}`);
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }

  return parsedValue;
};

const buildDatabaseConfig = (
  keys: {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
  },
  isRequired: boolean,
): DatabaseConfig => {
  const values = [
    process.env[keys.host],
    process.env[keys.port],
    process.env[keys.user],
    process.env[keys.password],
    process.env[keys.database],
  ];

  if (!isRequired && values.some((value) => !value)) {
    return {
      host: '',
      port: 0,
      user: '',
      password: '',
      database: '',
    };
  }

  return {
    host: requireEnv(keys.host),
    port: requireNumber(keys.port),
    user: requireEnv(keys.user),
    password: requireEnv(keys.password),
    database: requireEnv(keys.database),
  };
};

const config: AppConfig = {
  environment,
  server: {
    host: process.env.HOST ?? 'localhost',
    port: requireNumber('PORT', 5000),
  },
  auth: {
    accessTokenKey: requireEnv('ACCESS_TOKEN_KEY'),
    refreshTokenKey: requireEnv('REFRESH_TOKEN_KEY'),
    accessTokenAge: requireNumber('ACCESS_TOKEN_AGE', 3000),
  },
  database: buildDatabaseConfig({
    host: 'PGHOST',
    port: 'PGPORT',
    user: 'PGUSER',
    password: 'PGPASSWORD',
    database: 'PGDATABASE',
  }, !isTestEnvironment),
  testDatabase: buildDatabaseConfig({
    host: 'PGHOST_TEST',
    port: 'PGPORT_TEST',
    user: 'PGUSER_TEST',
    password: 'PGPASSWORD_TEST',
    database: 'PGDATABASE_TEST',
  }, isTestEnvironment),
};

export default config;
