import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class User extends Model {
  public readonly id!: number;
  public email!: string;
  public nickname!: string;
  public password!: string;
  public profile!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
    },
    profile: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType): void => {
  db.User.hasMany(db.Comment, {
    foreignKey: 'user_id',
    sourceKey: 'id',
  });
  db.User.hasMany(db.Report, {
    foreignKey: 'user_id',
    sourceKey: 'id',
  });
};

export default User;
