import * as express from 'express';
import Beer from '../models/beers';
import BookMark from '../models/bookmark';
import Comment from '../models/comments';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

// 즐겨찾기 추가
router.post('/', async (req, res) => {
  const { beer_id, token } = req.body;
  if (token) {
    const decoded: any = jwt.verify(token, 'secret_key');
    const user_id = decoded.userId;
    const addBookMark = await BookMark.create({
      user_id,
      beer_id,
    }).catch(() => res.sendStatus(500));
    if (addBookMark) {
      return res.status(201).send('즐겨찾기 추가');
    }
    return res.status(400).send('즐겨찾기 추가 실패');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

// 즐겨찾기 리스트
router.get('/', async (req, res) => {
  const { token } = req.body;
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
});

// 즐겨찾기 목록 삭제
router.delete('/:bookmark_id', async (req, res) => {
  const { bookmark_id, token } = req.params;

  // 삭제하려는 북마크 아이디의 유저 아이디와 토큰 유저아이디가 일치 확인
  const userCheck: any = await BookMark.findOne({
    where: {
      id: bookmark_id,
    },
  }).catch(() => res.sendStatus(500));

  if (token) {
    const decoded: any = jwt.verify(token, 'secret_key');
    const tokenId = decoded.userId;
    if (userCheck.user_id === tokenId) {
      const deleteBookMarkList = await BookMark.destroy({
        where: {
          id: bookmark_id,
        },
      }).catch(() => res.sendStatus(500));
      if (deleteBookMarkList) {
        return res.status(200).send('즐겨찾기 삭제');
      }
      return res.status(400).send('즐겨찾기를 목록을 찾을 수 없습니다.');
    }
    return res.status(403).send('권한이 없습니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

export default router;
