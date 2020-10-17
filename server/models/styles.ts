import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import { dbType } from './index';
import Beer from './beers';
import { sequelize } from './sequelize';

class Style extends Model {
  public readonly id!: number;
  public style_name!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;

  public getBeer!: HasManyGetAssociationsMixin<Beer>;
}

Style.init(
  {
    style_name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Style',
    tableName: 'Style',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType): void => {
  db.Style.hasMany(db.Beer, {
    foreignKey: 'style_id',
    sourceKey: 'id',
    as: 'getStyle',
  });
};

export default Style;
