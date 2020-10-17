import { Model, DataTypes } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Tag extends Model {
  public readonly id!: number;
  public tag_name!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}

Tag.init(
  {
    tag_name: {
      type: DataTypes.STRING,
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
  });
};

export default Tag;
