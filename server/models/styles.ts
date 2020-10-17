import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Style extends Model {
  public readonly id!: number;
  public style_name!: string;
  public style_id!: number;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Style.init(
  {
    style_name: {
      type: DataTypes.STRING,
    },
    style_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Style',
    tableName: 'Style',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {};

export default Style;
