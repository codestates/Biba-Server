import * as express from 'express';
import * as Sequelize from 'sequelize';
import Beer from '../models/beers';
import Comment from '../models/comments';
import Company from '../models/companies';
import Country from '../models/countries';
import Style from '../models/styles';
import BookMark from '../models/bookmark';
import AverageRate from '../modules/rate';

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
    attributes: ['id', 'beer_name', 'beer_img', 'rate'],
  });

  const sendAllBeerList = allBeerList.map((data) =>
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

  if (sendAllBeerList) {
    return res.status(200).json(sendAllBeerList);
  }
  return res.status(404).send('리스트를 찾을 수 없습니다.');
});

// 최신 맥주
router.get('/list-recent', async (req, res) => {
  const recentBeerList = await Beer.findAll({
    raw: true,
    attributes: ['id', 'beer_name', 'beer_img', 'rate'],
    include: [
      {
        model: Comment,
        as: 'getComment',
        attributes: [],
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
        rate: data.rate,
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
});

// 맥주 상세 정보
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  // 유저 아이디가 없을 때도 체크
  if (user_id === undefined) {
    res.status(403).send('접근 권한이 없습니다.');
  }
  let rate = 0;
  let user_review = false;
  let user_input = '';
  let user_star = false;
  let user_rate = 0;
  let user_bookmark = false;

  // 북마크 등록되어 있는지 체크
  const bookmarkCheck = await BookMark.findOne({
    where: {
      beer_id: id,
      user_id: user_id,
    },
    raw: true,
    attributes: ['user_id', 'beer_id'],
  });
  if (bookmarkCheck !== null) {
    user_bookmark = true;
  }

  // 코멘트 체크
  const commentCheck = await Comment.findOne({
    where: {
      beer_id: id,
      user_id: user_id,
    },
    raw: true,
    attributes: ['rate', 'comment'],
  });
  if (commentCheck !== null) {
    user_star = true;
    user_rate = commentCheck.rate;
    // console.log('코멘트 확인', commentCheck.comment === '');
    user_input = commentCheck.comment;
    user_review = true;
  }
  // 평균 별점
  AverageRate(id, rate);

  const beerInfo = await Beer.findOne({
    attributes: ['id', 'beer_name', 'beer_img', 'abv', 'ibu', 'rate'],
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
    ],
  });

  if (beerInfo !== null) {
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
        story: '맥주 관련 정보 등, 추가 예정',
        rate: beerInfo.rate,
        user_review,
        user_input,
        user_star,
        user_rate,
        user_bookmark,
      }
    );
    return res.status(200).json(sendbeerInfo);
  }
  return res.status(404).send('등록되어 있지 않은 맥주 입니다.');
});

export default router;
