import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Beer_tag extends Model {
  public readonly id!: number;
  public tag_id!: number;
  public beer_id!: number;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Beer_tag.init(
  {
    tag_id: {
      type: DataTypes.INTEGER,
    },
    beer_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Beer_tag',
    tableName: 'Beer_tag',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {};

export default Beer_tag;
