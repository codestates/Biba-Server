import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Comment extends Model {
  public readonly id!: number;
  public comment!: string;
  public rate!: number;
  public user_id!: number;
  public beer_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public ['User.nickname']: string;
  public ['Beer.beer_name']: string;
}

Comment.init(
  {
    comment: {
      type: DataTypes.STRING,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    beer_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comment',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }
);

export const associate = (db: dbType): void => {
  db.Comment.belongsTo(db.User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    as: 'User',
  });
  db.Comment.belongsTo(db.Beer, {
    foreignKey: 'beer_id',
    targetKey: 'id',
    as: 'Beer',
  });
};

export default Comment;
