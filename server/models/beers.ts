import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';
import Company from './companies';
import Style from './styles';
import Country from './countries';

// interface GetRate {
//   rate: { [key: string]: any };
// }

class Beer extends Model {
  public readonly id!: number;
  public beer_name!: string;
  public beer_name_en!: string;
  public search_word!: string;
  public beer_img!: string;
  public abv!: number;
  public ibu!: number;
  public company_id!: number;
  public country!: number; // ! 반드시 존재한
  public style_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public rate!: number;
  public story!: string;
  public explain!: string;
  public source!: string;
  public poster!: string;
  public mobile!: string;
  public show_poster!: number;
  public ['getComment.rate']: number;
  public ['getCompany.company']: string;
  public ['getCountry.country']: string;
  public ['getStyle.style_name']: string;
  public ['getBeer_tag.getTag.tag_name']: string;
  public getCompany!: BelongsToGetAssociationMixin<Company>;
  public geyStyle!: BelongsToGetAssociationMixin<Style>;
  public getCountry!: BelongsToGetAssociationMixin<Country>;
}

Beer.init(
  {
    beer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beer_name_en: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    search_word: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    beer_img: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    abv: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ibu: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    style_id: {
      type: DataTypes.INTEGER,
    },
    company_id: {
      type: DataTypes.INTEGER,
    },
    country_id: {
      type: DataTypes.INTEGER,
    },
    rate: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    story: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    explain: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    source: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    poster: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    mobile: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    show_poster: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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

export const associate = (db: dbType): void => {
  db.Beer.belongsTo(db.Style, {
    foreignKey: 'style_id',
    targetKey: 'id',
    as: 'getStyle',
  });
  db.Beer.hasMany(db.Beer_seller, {
    foreignKey: 'beer_id',
    sourceKey: 'id',
    as: 'getBeer_seller',
  });
  db.Beer.hasMany(db.Comment, {
    foreignKey: 'beer_id',
    sourceKey: 'id',
    as: 'getComment',
  });
  db.Beer.hasMany(db.Beer_tag, {
    foreignKey: 'beer_id',
    sourceKey: 'id',
    as: 'getBeer_tag',
  });
  db.Beer.belongsTo(db.Country, {
    as: 'getCountry',
    foreignKey: 'country_id',
    targetKey: 'id',
  });
  db.Beer.belongsTo(db.Company, {
    as: 'getCompany',
    foreignKey: 'company_id',
    targetKey: 'id',
  });
  db.Beer.hasMany(db.BookMark, {
    as: 'getBookMark',
    foreignKey: 'beer_id',
    sourceKey: 'id',
  });
};

export default Beer;
