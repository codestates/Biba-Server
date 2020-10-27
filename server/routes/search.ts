import * as express from 'express';
import Beer from '../models/beers';
import * as Sequelize from 'sequelize';
import Comment from '../models/comments';
import Style from '../models/styles';

const router = express.Router();

// 맥주 검색
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
        search_word: {
          [Sequelize.Op.like]: '%' + search_word + '%',
        },
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

export default router;
