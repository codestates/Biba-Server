import * as express from 'express';
import * as Sequelize from 'sequelize';
import Beer from '../models/beers';
import Comment from '../models/comments';
import Company from '../models/companies';
import Country from '../models/countries';
import Style from '../models/styles';
import BookMark from '../models/bookmark';
import AverageRate from '../modules/rate';
import Beer_tag from '../models/beer_tag';
import Tag from '../models/tags';
import Graph from '../models/graph';

const router = express.Router();

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
  try {
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
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 맥주 상세 정보
router.post('/:id', async (req, res) => {
  try {
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
    let bookmark = false;

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
      bookmark = true;
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
      if (user_input === '') {
        user_review = false;
      } else {
        user_review = true;
      }
    }
    // 평균 별점
    AverageRate(id, rate);

    const beerInfo = await Beer.findOne({
      attributes: [
        'id',
        'beer_name',
        'beer_name_en',
        'beer_img',
        'abv',
        'ibu',
        'rate',
        'story',
        'explain',
        'source',
      ],
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
          model: Beer_tag,
          as: 'getBeer_tag',
          attributes: [],
          include: [
            {
              model: Tag,
              as: 'getTag',
              attributes: ['tag_name'],
            },
          ],
        },
      ],
    });

    const findTag = await Beer_tag.findAll({
      where: {
        beer_id: id,
      },
      raw: true,
      attributes: [],
      include: [
        {
          model: Tag,
          as: 'getTag',
          attributes: ['tag_name'],
        },
      ],
    });

    const tags = findTag.reduce((acc: string[], val) => {
      let tag = val['getTag.tag_name'];
      acc.push(tag);
      return acc;
    }, []);

    const beerGraph = await Graph.findOne({
      where: {
        id,
      },
      raw: true,
      attributes: ['sparkling', 'sweet', 'accessibility', 'body', 'bitter'],
    });

    if (beerInfo !== null && beerGraph) {
      const sendbeerInfo = Object.assign(
        {},
        {
          id: beerInfo.id,
          beer_name: beerInfo.beer_name,
          beer_name_en: beerInfo.beer_name_en,
          beer_img: beerInfo.beer_img,
          abv: beerInfo.abv,
          ibu: beerInfo.ibu,
          company: beerInfo['getCompany.company'],
          country: beerInfo['getCountry.country'],
          style_name: beerInfo['getStyle.style_name'],
          story: beerInfo.story,
          explain: beerInfo.explain,
          source: beerInfo.source,
          rate: beerInfo.rate,
          tags,
          user_review,
          user_input,
          user_star,
          user_rate,
          bookmark,
          sparkling: beerGraph.sparkling,
          sweet: beerGraph.sweet,
          accessibility: beerGraph.accessibility,
          body: beerGraph.body,
          bitter: beerGraph.bitter,
        }
      );
      return res.status(200).json(sendbeerInfo);
    }
    return res.status(404).send('등록되어 있지 않은 맥주 입니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
