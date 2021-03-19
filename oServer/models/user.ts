import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class User extends Model {
  public readonly id!: number;
  public email!: string;
  public nickname!: string;
  public password!: string;
  public profile!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      defaultValue: '',
    },
    profile: {
      type: DataTypes.STRING,
      defaultValue: '',
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
  db.User.hasMany(db.BookMark, {
    foreignKey: 'user_id',
    sourceKey: 'id',
  });
};

export default User;
