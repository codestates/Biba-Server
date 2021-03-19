import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Seller extends Model {
  public readonly id!: number;
  public seller!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Seller.init(
  {
    seller: {
      type: DataTypes.STRING,
      defaultValue: '',
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

export const associate = (db: dbType): void => {
  db.Seller.hasMany(db.Beer_seller, {
    foreignKey: 'seller_id',
    sourceKey: 'id',
  });
};

export default Seller;
