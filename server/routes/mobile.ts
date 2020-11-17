import * as express from 'express';
import Tag from '../models/tags';
import Beer from '../models/beers';

const router = express.Router();

//-----------------------------------------------------------모바일 검색바
router.get('/search', async (req, res) => {
  try {
    const tagList = await Tag.findAll({
      raw: true,
      limit: 5,
      attributes: ['tag_name'],
      order: [['count', 'DESC']],
    });

    const tags = tagList.reduce((acc: string[], val) => {
      const tag = val['tag_name'];
      acc.push(tag);
      return acc;
    }, []);

    const beerList = await Beer.findAll({
      where: {
        recommend: 1,
      },
      raw: true,
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
    });

    const sendBeerList = beerList.map((data) =>
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
      return res.status(200).json({ recommend: sendBeerList, tags });
    } else {
      return res.status(404).send('리스트를 찾을 수 없습니다.');
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
