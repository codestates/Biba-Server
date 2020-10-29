import * as express from 'express';
import * as Sequelize from 'sequelize';
import Beer from '../models/beers';

const router = express.Router();

// 즐겨찾기 추가하지 않은 맥주
router.post('/');

// 밀 맥주
router.get('/wheat', async (req, res) => {
  try {
    const BeerList = await Beer.findAll({
      limit: 10,
      raw: true,
      order: Sequelize.literal('rand()'),
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      where: {
        style_id: 7,
      },
    });

    const sendBeerList = BeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );
    if (sendBeerList) {
      return res.status(200).json(sendBeerList);
    }
    return res.status(400).json('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 독일 맥주
router.get('/germany', async (req, res) => {
  try {
    const germanyBeerList = await Beer.findAll({
      limit: 10,
      raw: true,
      order: Sequelize.literal('rand()'),
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      where: {
        country_id: 6,
      },
    });
    const sendgermanyBeerList = germanyBeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );
    if (sendgermanyBeerList) {
      return res.status(200).json(sendgermanyBeerList);
    }
    return res.status(400).json('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 최신 맥주
router.get('/recent', async (req, res) => {
  try {
    const recentBeerList = await Beer.findAll({
      raw: true,
      limit: 10,
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      order: [['createdAt', 'DESC']],
    });
    const sendrecentBeerList = recentBeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );

    if (sendrecentBeerList) {
      return res.status(200).json(sendrecentBeerList);
    }
    return res.status(404).send('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 인기 맥주
// rate 높은 순으로 정렬
// 최근 코멘트 우선순으로
// 10개 까지 랜덤하게 정렬
router.get('/popular', async (req, res) => {
  try {
    const popularBeerList = await Beer.findAll({
      limit: 10,
      // order: Sequelize.literal('rand()'),
      raw: true,
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      where: {
        rate: {
          [Sequelize.Op.gte]: 4, // 'rate' >= 4
        },
      },
    });

    const sendpopularBeerList = popularBeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );

    if (sendpopularBeerList) {
      return res.status(200).json(sendpopularBeerList);
    }
    return res.status(404).send('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
