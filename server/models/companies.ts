import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Company extends Model {
  public readonly id!: number;
  public company!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
  {
    company: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Company',
    tableName: 'Company',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType): void => {
  db.Company.hasMany(db.Beer, {
    foreignKey: 'company_id',
    sourceKey: 'id',
  });
};

export default Company;
