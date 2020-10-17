import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Country extends Model {
  public readonly id!: number;
  public country!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Country.init(
  {
    country: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Country',
    tableName: 'Country',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {};

export default Country;
