import * as dotenv from 'dotenv';
dotenv.config();

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
  [key: string]: any;
};

interface IConfigGroup {
  development: Config;
  production: Config;
}

const config: IConfigGroup = {
  development: {
    username: 'root',
    password: process.env.DB_PD!,
    database: 'Biba',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  },
  production: {
    username: 'root',
    password: process.env.DB_PD!,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  },
};

export default config;
