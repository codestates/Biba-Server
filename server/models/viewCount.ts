import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class ViewCount extends Model {
  public readonly id!: number;
  public user_id!: number;
  public beer_id!: number;
  public count!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ViewCount.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    beer_id: {
      type: DataTypes.INTEGER,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'ViewCount',
    tableName: 'ViewCount',
  }
);

export const associate = (db: dbType): void => {
  db.ViewCount.belongsTo(db.User, {
    foreignKey: 'user_id',
    targetKey: 'id',
  });
  db.ViewCount.belongsTo(db.Beer, {
    foreignKey: 'beer_id',
    targetKey: 'id',
    as: 'getBeer',
  });
};

export default ViewCount;
