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
import viewCount from '../modules/viewCount';

const router = express.Router();

//----------------------------------------------------------매인 맥주 리스트(오늘의 맥주) (포스터 선별해서 보여주기)
router.get('/list', async (req, res) => {
  try {
    const allBeerList = await Beer.findAll({
      raw: true,
      where: {
        show_poster: 1,
      },
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'beer_name', 'poster', 'rate', 'mobile'],
    });

    const sendAllBeerList = allBeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.poster,
          mobile: data.mobile,
          rate: data.rate,
        }
      )
    );

    const deley = setTimeout(function () {
      res.status(200).json(sendAllBeerList);
    }, 1500);

    if (sendAllBeerList) {
      return deley;
    } else {
      return res.status(404).send('리스트를 찾을 수 없습니다.');
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

//----------------------------------------------------------맥주 상세 정보
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
      user_input = commentCheck.comment;
      if (user_input === '') {
        user_review = false;
      } else {
        user_review = true;
      }
    }
    // 평균 별점
    AverageRate(id);
    viewCount(id, user_id);

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
