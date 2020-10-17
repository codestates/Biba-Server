import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Beer_seller extends Model {
  public readonly id!: number;
  public beer_id!: number;
  public seller_id!: number;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Beer_seller.init(
  {
    beer_id: {
      type: DataTypes.INTEGER,
    },
    seller_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Beer_seller',
    tableName: 'Beer_seller',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType): void => {
  db.Beer_seller.belongsTo(db.Beer, {
    foreignKey: 'beer_id',
    targetKey: 'id',
  });
  db.Beer_seller.belongsTo(db.Seller, {
    foreignKey: 'seller_id',
    targetKey: 'id',
  });
};

export default Beer_seller;
