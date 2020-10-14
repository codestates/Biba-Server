import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Report extends Model {
  public readonly id!: number;
  public user_id!: number;
  public beer_name!: string;
  public comment!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Report.init(
  {
    user_id: {
      type: DataTypes.STRING,
    },
    beer_name: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Report',
    tableName: 'Report',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {};

export default Report;
