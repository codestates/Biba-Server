import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Graph extends Model {
  public readonly id!: number;
  public sparkling!: number;
  public sweet!: number;
  public accessibility!: number;
  public body!: number;
  public bitter!: number;
  public beer_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Graph.init(
  {
    sparkling: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    sweet: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    accessibility: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    body: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    beer_id: {
      type: DataTypes.INTEGER,
    },
    bitter: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Graph',
    tableName: 'Graph',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  }
);

export const associate = (db: dbType): void => {};

export default Graph;
