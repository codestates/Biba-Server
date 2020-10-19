import * as express from 'express';
import Beer from '../models/beers';
import BookMark from '../models/bookmark';
import Comment from '../models/comments';

const router = express.Router();

// 즐겨찾기 추가
router.post('/', async (req, res) => {
  // userid 찾고
  let { beer_id, user_id } = req.body;
  if (user_id) {
    const addBookMark = await BookMark.create({
      user_id,
      beer_id,
    }).catch((err) => res.sendStatus(500));
    if (addBookMark) {
      return res.status(201).send('즐겨찾기 추가');
    }
    return res.status(400).send('즐겨찾기 추가 실패');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

// 즐겨찾기 리스트
router.get('/:user_id', async (req, res) => {
  // user 정보
  let { user_id } = req.params;
  // 토큰 확인?
  console.log(user_id);
  //   let token;
  if (user_id) {
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
    }).catch((err) => res.sendStatus(500));
    if (userBookMarkList) {
      return res.status(200).json(userBookMarkList);
    }
    return res.status(400).send('요청 정보를 찾을 수 없습니다.');
  }
  return res.status(401).send('유저 정보를 찾을 수 없습니다.');
});

// 즐겨찾기 목록 삭제
router.delete('/:bookmark_id', async (req, res) => {
  let { bookmark_id } = req.params;
  const deleteBookMarkList = await BookMark.destroy({
    where: {
      id: bookmark_id,
    },
  }).catch((err) => res.sendStatus(500));
  if (deleteBookMarkList) {
    return res.status(200).send('즐겨찾기 삭제');
  }
  return res.status(400).send('즐겨찾기를 목록을 찾을 수 없습니다.');
});

export default router;
