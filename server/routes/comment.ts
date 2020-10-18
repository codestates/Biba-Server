import * as express from 'express';
import Comment from '../models/comments';
import User from '../models/user';

const router = express.Router();

// 코멘트 리스트
router.get('/:beer_id', async (req, res) => {
  let { beer_id } = req.params;
  const beerComment = await Comment.findAll({
    where: { beer_id },
    raw: true,
    include: [
      {
        model: User,
        attributes: ['nickname'],
      },
    ],
  }).catch(() => res.sendStatus(500));

  if (beerComment) {
    return res.status(200).json(beerComment);
  }
  return res.status(404).send('코멘트를 찾을 수 없습니다.');
});

// 코멘트 생성
router.post('/create', async (req, res) => {
  let { token, comment, rate, user_id, beer_id } = req.body;
  // 토큰 검사??
  if (token) {
    const createComment = await Comment.create({
      comment,
      rate,
      user_id,
      beer_id,
    }).catch(() => res.sendStatus(500));
    if (createComment) {
      return res.status(201).json(createComment);
    }
    return res.status(400).send('잘못된 요청입니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

// 코멘트 수정
router.post('/update', async (req, res) => {
  let { token, comment, rate, id } = req.body;
  if (token) {
    const updateComment = await Comment.update(
      {
        rate,
        comment,
      },
      {
        where: { id },
      }
    ).catch(() => res.sendStatus(500));
    if (updateComment) {
      return res.status(201).send('수정 완료');
    }
    return res.status(400).send('잘못된 요청입니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

// 코멘트 삭제
router.post('/delete', async (req, res) => {
  let { token, id } = req.body;
  //토큰 확인
  if (token) {
    const deleteComment = await Comment.destroy({
      where: {
        id,
      },
    }).catch((err) => res.sendStatus(500));
    if (deleteComment) {
      return res.status(201).send('코멘트 삭제');
    }
    return res.status(400).send('잘못 된 요청입니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

export default router;
