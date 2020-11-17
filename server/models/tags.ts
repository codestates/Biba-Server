import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Tag extends Model {
  public readonly id!: number;
  public tag_name!: string;
  public count!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public ['getBeer_tag.getBeer.id']: string;
  public ['getBeer_tag.getBeer.beer_name']: string;
  public ['getBeer_tag.getBeer.beer_img']: string;
  public ['getBeer_tag.getBeer.rate']: string;
}

Tag.init(
  {
    tag_name: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Tag',
    tableName: 'Tag',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associate = (db: dbType): void => {
  db.Tag.hasMany(db.Beer_tag, {
    foreignKey: 'tag_id',
    sourceKey: 'id',
    as: 'getBeer_tag',
  });
};

export default Tag;
