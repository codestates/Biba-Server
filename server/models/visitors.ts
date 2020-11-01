import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Visitors extends Model {
  public readonly id!: number;
  public todayVisit!: number;
  public totalVisit!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Visitors.init(
  {
    tadayVisit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalVisit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Visitors',
    tableName: 'Visitors',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType): void => {};

export default Visitors;
