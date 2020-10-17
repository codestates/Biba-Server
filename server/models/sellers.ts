import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Seller extends Model {
  public readonly id!: number;
  public seller!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Seller.init(
  {
    seller: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Seller',
    tableName: 'Seller',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {};

export default Seller;
