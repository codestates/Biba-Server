import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Comment extends Model {
  public readonly id!: number;
  public comment!: string;
  public rate!: number;
  public user_id!: number;
  public beer_id!: number;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
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
  });
  db.Comment.belongsTo(db.Beer, {
    foreignKey: 'beer_id',
    targetKey: 'id',
  });
};

export default Comment;
