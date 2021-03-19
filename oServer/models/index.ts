import Beer_seller, { associate as associateBeer_sell } from './beer_sellers';
import Beer_tag, { associate as associateBeer_tag } from './beer_tag';
import Beer, { associate as associateBeer } from './beers';
import Comment, { associate as associateComment } from './comments';
import Company, { associate as associateCompany } from './companies';
import Country, { associate as associateCountry } from './countries';
import Report, { associate as associateReport } from './report';
import Seller, { associate as associateSeller } from './sellers';
import Style, { associate as associateStyle } from './styles';
import Tag, { associate as associateTag } from './tags';
import User, { associate as associateUser } from './user';
import BookMark, { associate as associateBookMark } from './bookmark';
import Graph, { associate as associateGraph } from './graph';
import ViewCount, { associate as associateViewCount } from './viewCount';
import Visitors, { associate as associateVisitors } from './visitors';

export * from './sequelize';

const db = {
  Beer_seller,
  Beer_tag,
  Beer,
  Comment,
  Company,
  Country,
  Report,
  Seller,
  Style,
  Tag,
  User,
  BookMark,
  Graph,
  ViewCount,
  Visitors,
};

export type dbType = typeof db;
associateBeer_sell(db);
associateBeer_tag(db);
associateBeer(db);
associateComment(db);
associateCompany(db);
associateCountry(db);
associateReport(db);
associateSeller(db);
associateStyle(db);
associateTag(db);
associateUser(db);
associateBookMark(db);
associateGraph(db);
associateViewCount(db);
associateVisitors(db);
