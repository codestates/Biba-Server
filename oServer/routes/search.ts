import * as express from 'express';
import Beer from '../models/beers';
import * as Sequelize from 'sequelize';
import Comment from '../models/comments';
import Style from '../models/styles';
import Tag from '../models/tags';
import Beer_tag from '../models/beer_tag';
import tagCount from '../modules/tagCount';

const router = express.Router();

//-----------------------------------------------------------맥주 검색
router.get('/:search_word', async (req, res) => {
  try {
    const { search_word } = req.params;
    if (search_word.length === 0) {
      return res.status(400).send('검색어를 찾을 수 없습니다.');
    }
    const searchBeerResults = await Beer.findAll({
      raw: true,
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      where: {
        [Sequelize.Op.or]: [
          {
            search_word: {
              [Sequelize.Op.like]: '%' + search_word + '%',
            },
          },
          {
            beer_name_en: {
              [Sequelize.Op.like]: '%' + search_word + '%',
            },
          },
          {
            id: {
              [Sequelize.Op.like]: '%' + search_word + '%',
            },
          },
        ],
      },
    });

    const sendSearchBeerResults = searchBeerResults.map((data) =>
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

    return res.status(200).json(sendSearchBeerResults);
  } catch (e) {
    return res.sendStatus(500);
  }
});

//-----------------------------------------------------------태그 검색
router.post('/tag', async (req, res) => {
  try {
    const { tag } = req.body;
    if (!tag) {
      return res.status(400).send('태그를 찾을 수 없습니다.');
    } else {
      const searchTag = await Tag.findAll({
        raw: true,
        attributes: ['id'],
        where: {
          tag_name: {
            [Sequelize.Op.like]: '%' + tag + '%',
          },
        },
        include: [
          {
            model: Beer_tag,
            as: 'getBeer_tag',
            attributes: [],
            include: [
              {
                model: Beer,
                attributes: ['id', 'beer_name', 'beer_img', 'rate'],
                as: 'getBeer',
              },
            ],
          },
        ],
      });
      tagCount(searchTag[0].id);
      const sendSearchTag = searchTag.map((data) =>
        Object.assign(
          {},
          {
            id: data['getBeer_tag.getBeer.id'],
            beer_name: data['getBeer_tag.getBeer.beer_name'],
            beer_img: data['getBeer_tag.getBeer.beer_img'],
            rate: data['getBeer_tag.getBeer.rate'],
          }
        )
      );
      return res.status(200).json(sendSearchTag);
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
