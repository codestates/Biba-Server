import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Beer extends Model {
  public readonly id!: number;
  public beer_name!: string;
  public beer_img!: string;
  public abv!: number;
  public ibu!: number;
  public company_id!: number;
  public country!: number; // ! 반드시 존재한
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Beer.init(
  {
    beer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beer_img: {
      type: DataTypes.STRING,
    },
    abv: {
      type: DataTypes.INTEGER,
    },
    ibu: {
      type: DataTypes.INTEGER,
    },
    company_id: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Beer',
    tableName: 'Beer',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType) => {};

export default Beer;
