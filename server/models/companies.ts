import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Company extends Model {
  public readonly id!: number;
  public company!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Company.init(
  {
    company: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Company',
    tableName: 'Company',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {};

export default Company;