import * as express from 'express';
import Comment from '../models/comments';
import User from '../models/user';
import * as jwt from 'jsonwebtoken';
import Beer from '../models/beers';
import { IncomingHttpHeaders } from 'http';
import { type } from 'os';

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
        as: 'User',
        attributes: ['nickname'],
      },
    ],
  });

  const sendBeerComment = beerComment.map((data) =>
    Object.assign(
      {},
      {
        id: data.id,
        comment: data.comment,
        rate: data.rate,
        beer_id: data.beer_id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        nickname: data['User.nickname'],
      }
    )
  );

  if (beerComment) {
    return res.status(200).json(sendBeerComment);
  }
  return res.status(404).send('코멘트를 찾을 수 없습니다.');
});

// 내가 작성한 리뷰
router.post('/mylist', async (req, res) => {
  const { token }: any = req.headers;
  if (token) {
    const decoded: any = jwt.verify(token, 'secret_key');
    const user_id = decoded.userId;
    const myCommentList = await Comment.findAll({
      where: {
        user_id,
      },
      raw: true,
      include: [
        {
          model: Beer,
          as: 'Beer',
          attributes: ['beer_name'],
        },
        {
          model: User,
          as: 'User',
          attributes: ['nickname'],
        },
      ],
    });

    const sendMyList = myCommentList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          comment: data.comment,
          rate: data.rate,
          beer_id: data.beer_id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          nickname: data['User.nickname'],
          beer_name: data['Beer.beer_name'],
        }
      )
    );
    if (myCommentList) {
      return res.status(200).json(sendMyList);
    }
    return res.send('코멘트를 찾을 수 없습니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

interface tokenType extends IncomingHttpHeaders {
  token?: string;
}

type decodedType = {
  data: string;
  userId: number;
  iat: number;
};

interface Idecoded {
  decoded: decodedType | string;
}

// 코멘트 생성
router.post('/create', async (req, res) => {
  const { comment, rate, beer_id } = req.body;
  const token: any = req.headers['token'];
  console.log('token', token);
  if (token) {
    const decoded: any = jwt.verify(token, 'secret_key');
    console.log('decoded', decoded);
    const user_id = decoded.userId;
    const createComment = await Comment.create({
      comment,
      rate,
      user_id,
      beer_id,
    }).catch(() => res.sendStatus(500));
    if (createComment) {
      return res.status(201).send('코멘트 생성');
    }
    return res.status(400).send('잘못된 요청입니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

// 코멘트 수정
router.post('/update', async (req, res) => {
  const { comment, rate, id } = req.body;
  const { token }: any = req.headers;
  const userCheck: any = await Comment.findOne({
    where: {
      id,
    },
  });

  if (token) {
    const decoded: any = jwt.verify(token, 'secret_key');
    const user_id = decoded.userId;
    if (userCheck.user_id === user_id) {
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
    return res.status(403).send('삭제 권한이 없습니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

// 코멘트 삭제
router.delete('/delete', async (req, res) => {
  let { id } = req.body;
  const { token }: any = req.headers;

  const userCheck: any = await Comment.findOne({
    where: {
      id,
    },
  }).catch(() => res.sendStatus(500));

  if (token) {
    const decoded: any = jwt.verify(token, 'secret_key');
    const user_id = decoded.userId;
    // 토큰이 있을때 토큰에서 찾은 유저 아이디와 삭제하려는 멘트의 유저 아이디가 일치
    if (userCheck.user_id === user_id) {
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
    return res.status(403).send('삭제 권한이 없습니다.');
  }
  return res.status(401).send('회원 정보를 찾을 수 없습니다.');
});

export default router;
