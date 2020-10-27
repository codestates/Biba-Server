import * as express from 'express';
import Beer from '../models/beers';
import BookMark from '../models/bookmark';
import Comment from '../models/comments';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

// 즐겨찾기 추가 or 삭제
router.post('/', async (req, res) => {
  try {
    const { beer_id, token } = req.body;
    if (token) {
      const decoded: any = jwt.verify(token, 'secret_key');
      const user_id = decoded.userId;
      const [result, created] = await BookMark.findOrCreate({
        where: {
          user_id,
          beer_id,
        },
      });
      if (created) {
        res.status(201).json({ bookmark: true });
      } else {
        BookMark.destroy({
          where: {
            user_id,
            beer_id,
          },
        });
        res.status(201).json({ bookmark: false });
      }
    }
    return res.status(401).send('유저 정보를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});
// const decoded: any = jwt.verify(token, 'secret_key');
// const user_id = decoded.userId;
// const addBookMark = await BookMark.create({
//   user_id,
//   beer_id,
// }).catch(() => res.sendStatus(500));
// if (addBookMark) {
//   return res.status(201).json({ bookmark: true });
// }
// return res.status(400).send('즐겨찾기 추가 실패');

// 즐겨찾기 리스트
router.get('/', async (req, res) => {
  const { token } = req.body;
  try {
    if (token) {
      const decoded: any = jwt.verify(token, 'secret_key');
      const user_id = decoded.userId;
      const userBookMarkList = await BookMark.findAll({
        raw: true,
        attributes: ['id'],
        where: {
          user_id,
        },
        include: [
          {
            model: Beer,
            as: 'getBeer',
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

      const sendUserBookMarkList = userBookMarkList.map((data) =>
        Object.assign(
          {},
          {
            beer_id: data['getBeer.id'],
            beer_name: data['getBeer.beer_name'],
            beer_img: data['getBeer.beer_img'],
            rate: data['getBeer.getComment.rate'],
          }
        )
      );

      if (userBookMarkList) {
        return res.status(200).json(sendUserBookMarkList);
      }
      return res.status(400).send('요청 정보를 찾을 수 없습니다.');
    }

    return res.status(401).send('유저 정보를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
