import * as express from 'express';
import Beer from '../models/beers';
import Comment from '../models/comments';
import Style from '../models/styles';

const router = express.Router();

// 모든 스타일 리스트
router.get('/', async (req, res) => {
  const allStyleList = await Style.findAll({
    attributes: ['id', 'style_name'],
  }).catch((err) => console.log(err));

  if (allStyleList) {
    return res.status(200).json(allStyleList);
  }
  return res.status(404).send('리스트를 찾을 수 없습니다.');
});

// 해당 스타일을 가지고 있는 모든 맥주 리스트
router.get('/:style_id', async (req, res) => {
  const { style_id } = req.params;
  const beerByStlye = await Beer.findAll({
    where: { style_id },
    raw: true,
    attributes: ['id', 'beer_name'],
    include: [
      {
        model: Comment,
        as: 'getComment',
        attributes: ['rate'],
      },
    ],
  }).catch((err) => console.log(err));

  if (beerByStlye) {
    return res.status(200).json(beerByStlye);
  }
  return res.status(404).send('해당 스타일의 맥주를 찾을 수 없습니다.');
});

export default router;
