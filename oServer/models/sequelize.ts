import { Sequelize } from 'sequelize';
// import * as typeSequelize from 'sequelize-typescript';
// import { SequelizeTypescriptMigration } from 'sequelize-typescript-migration';
import config from '../config/config';
//import * as path from 'path';

const env =
  (process.env.NODE_ENV as 'production' | 'development') || 'development';
const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, config[env]);

// const migration = async () =>
//   await SequelizeTypescriptMigration.makeMigration(typeSequelize.Sequelize, {
//     outDir: path.join(__dirname, '../migrations'),
//     migrationName: 'add-awesome-field-in-my-table',
//     preview: false,
//   });

export { sequelize };
export default sequelize;
