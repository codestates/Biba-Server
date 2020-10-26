import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Report extends Model {
  public readonly id!: number;
  public user_id!: number;
  public beer_name!: string;
  public comment!: string;
  public recommend!: boolean;
  public request!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Report.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    beer_name: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    recommend: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    request: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

export const associate = (db: dbType): void => {
  db.Report.belongsTo(db.User, {
    foreignKey: 'user_id',
    targetKey: 'id',
  });
};

export default Report;
