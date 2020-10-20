import * as express from 'express';
import * as Sequelize from 'sequelize';
import Beer from '../models/beers';
import Comment from '../models/comments';
import Company from '../models/companies';
import Country from '../models/countries';
import Style from '../models/styles';

const router = express.Router();

// interface IBeer extends Beer {
//   ['getComment.rate']: number;
//   ['getCountry.country']: string;
//   ['getStyle.style_name']: string;

// }

// 모든 맥주 리스트 (랜덤하게)
router.get('/list', async (req, res) => {
  //   const where = {};
  //   if (parseInt(req.query.lastId, 10)) {
  //     where = {
  //       id: {
  //         [Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
  //       }, 무한 스크롤 어떤식으로?
  //     };
  //   }
  const allBeerList = await Beer.findAll({
    order: Sequelize.literal('rand()'),
    limit: 10,
    raw: true,
    attributes: ['id', 'beer_name', 'beer_img'],
    include: [
      {
        model: Comment,
        as: 'getComment',
        attributes: ['rate'],
      },
    ],
  });

  const sendAllBeerList = allBeerList.map((data) =>
    Object.assign(
      {},
      {
        id: data.id,
        beer_name: data.beer_name,
        beer_img: data.beer_img,
        rate: data['getComment.rate'],
      }
    )
  );

  if (sendAllBeerList) {
    return res.status(200).json(sendAllBeerList);
  }
  return res.status(404).send('리스트를 찾을 수 없습니다.');
});

// 최신 맥주
router.get('/list-recent', async (req, res) => {
  const recentBeerList = await Beer.findAll({
    raw: true,
    attributes: ['id', 'beer_name', 'beer_img'],
    include: [
      {
        model: Comment,
        as: 'getComment',
        attributes: ['rate'],
        order: ['createdAt', 'DESC'],
      },
    ],
  });

  const sendrecentBeerList = recentBeerList.map((data) =>
    Object.assign(
      {},
      {
        id: data.id,
        beer_name: data.beer_name,
        beer_img: data.beer_img,
        rate: data['getComment.rate'],
      }
    )
  );

  if (sendrecentBeerList) {
    return res.status(200).json(sendrecentBeerList);
  }
  return res.status(404).send('리스트를 찾을 수 없습니다.');
});

// 인기 맥주
// rate 높은 순으로 정렬
// 최근 코멘트 우선순으로
// 10개 까지 랜덤하게 정렬
router.get('/list-popular', async (req, res) => {
  const popularBeerList = await Beer.findAll({
    limit: 10,
    raw: true,
    attributes: ['id', 'beer_name', 'beer_img'],
    include: [
      {
        model: Comment,
        where: {
          rate: {
            [Sequelize.Op.gte]: 4, // 'rate' >= 4
          },
        },
        as: 'getComment',
        attributes: ['rate'],
        order: ['updateAt', 'DESC'], // 최근 코멘트 작성 우선순위
      },
    ],
  });

  const sendpopularBeerList = popularBeerList.map((data) =>
    Object.assign(
      {},
      {
        id: data.id,
        beer_name: data.beer_name,
        beer_img: data.beer_img,
        rate: data['getComment.rate'],
      }
    )
  );

  if (sendpopularBeerList) {
    return res.status(200).json(sendpopularBeerList);
  }
  return res.status(404).send('리스트를 찾을 수 없습니다.');
});

// 맥주 상세 정보
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const beerInfo: any = await Beer.findOne({
    attributes: ['id', 'beer_name', 'beer_img', 'abv', 'ibu'],
    where: { id },
    raw: true,
    include: [
      {
        model: Company,
        as: 'getCompany',
        attributes: ['company'],
      },
      {
        model: Country,
        as: 'getCountry',
        attributes: ['country'],
      },
      {
        model: Style,
        as: 'getStyle',
        attributes: ['style_name'],
      },
      {
        model: Comment,
        as: 'getComment',
        attributes: ['rate'],
      },
    ],
  });
  const sendbeerInfo = Object.assign(
    {},
    {
      id: beerInfo.id,
      beer_name: beerInfo.beer_name,
      beer_img: beerInfo.beer_img,
      abv: beerInfo.abv,
      ibu: beerInfo.ibu,
      company: beerInfo['getComment.company'],
      country: beerInfo['getCountry.country'],
      style_name: beerInfo['getStyle.style_name'],
      rate: beerInfo['getComment.rate'],
    }
  );
  if (beerInfo) {
    return res.status(200).json(sendbeerInfo);
  }
  return res.status(404).send('등록되어 있지 않은 맥주 입니다.');
});

export default router;
