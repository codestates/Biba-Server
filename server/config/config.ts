import * as dotenv from 'dotenv';
dotenv.config();
const username = process.env.DB_USER || 'root';
const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_POTR || '3306';

type timeOption = {
  dateStrings: boolean;
  typeCast: boolean;
};

type Config = {
  username: string;
  password: string;
  database: string;
  timezone: string;
  dialectOptions: timeOption;
  host: string;
  port: any;
  [key: string]: any;
};

interface IConfigGroup {
  development: Config;
  production: Config;
}

const config: IConfigGroup = {
  development: {
    username,
    password: process.env.DB_PD!,
    database: 'Biba',
    host,
    port,
    dialect: 'mysql',
    timezone: '+09:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  },
  production: {
    username,
    password: process.env.DB_PD!,
    database: 'Biba_Prod',
    host,
    port,
    dialect: 'mysql',
    timezone: '+09:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  },
};

export default config;
