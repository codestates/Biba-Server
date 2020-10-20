import * as express from 'express';
import Beer from '../models/beers';
import Comment from '../models/comments';
import Tag from '../models/tags';
import Beer_tag from '../models/beer_tag';

const router = express.Router();

// 모든 태그 리스트
router.get('/', async (req, res) => {
  const allTagList = await Tag.findAll({
    attributes: ['id', 'tag_name'],
  }).catch((err) => console.log(err));
  if (allTagList) {
    return res.status(200).json(allTagList);
  }
  return res.status(404).send('리스트를 찾을 수 없습니다.');
});

// 해당 태그를 가지고 있는 모든 맥주 리스트
// 모든 맥주 리스트처럼 맥주id, 이름과 평점 돌려줌
router.get('/:tag_id', async (req, res) => {
  const { tag_id } = req.params;
  const beerByTag = await Beer_tag.findAll({
    where: { tag_id },
    raw: true,
    attributes: {
      exclude: ['id', 'tag_id', 'beer_id', 'createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Beer,
        attributes: ['id', 'beer_name', 'beer_img'],
        include: [
          {
            model: Comment,
            as: 'getComment',
            attributes: ['rate'],
          },
        ],
      },
    ],
  });

  const sendBeerByTag = beerByTag.map((data) =>
    Object.assign(
      {},
      {
        beer_id: data['Beer.id'],
        beer_name: data['Beer.beer_name'],
        beer_img: data['Beer.beer_img'],
        rate: data['Beer.getComment.rate'],
      }
    )
  );

  if (beerByTag) {
    return res.status(200).json(sendBeerByTag);
  }
  return res.status(404).send('해당 태그의 맥주를 찾을 수 없습니다.');
});

export default router;
