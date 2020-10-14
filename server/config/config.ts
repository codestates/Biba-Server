import * as dotenv from 'dotenv';
dotenv.config();

type Config = {
  username: string;
  password: string;
  database: string;
  host: string;
  [key: string]: string;
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
  },
  production: {
    username: 'root',
    password: process.env.DB_PD!,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

export default config;
