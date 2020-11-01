import * as express from 'express';
import Comment from '../models/comments';
import User from '../models/user';
import * as jwt from 'jsonwebtoken';
import Beer from '../models/beers';
import AverageRate from '../modules/rate';
import * as dotenv from 'dotenv';
dotenv.config();
const secret = process.env.JWT!;

const router = express.Router();

// 코멘트 리스트
router.get('/:beer_id', async (req, res) => {
  try {
    let { beer_id } = req.params;
    const beerComment = await Comment.findAll({
      where: { beer_id },
      raw: true,
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['nickname', 'id', 'profile'],
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
          user_id: data['User.id'],
          profile: data['User.profile'],
        }
      )
    );
    if (beerComment) {
      return res.status(200).json(sendBeerComment);
    }
    return res.status(404).send('코멘트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 내가 작성한 리뷰 (업데이트순)
router.post('/mylist', async (req, res) => {
  try {
    const { token } = req.body;
    if (token) {
      const decoded: any = jwt.verify(token, secret);
      const user_id = decoded.userId;
      const myCommentList = await Comment.findAll({
        where: {
          user_id,
        },
        order: [['updatedAt', 'DESC']],
        raw: true,
        include: [
          {
            model: Beer,
            as: 'Beer',
            attributes: ['beer_name', 'beer_img'],
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
            comment: data.comment,
            rate: data.rate,
            id: data.beer_id,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            nickname: data['User.nickname'],
            beer_name: data['Beer.beer_name'],
            beer_img: data['Beer.beer_img'],
          }
        )
      );
      if (myCommentList) {
        return res.status(200).json(sendMyList);
      }
      return res.send('코멘트를 찾을 수 없습니다.');
    } else {
      return res.status(401).send('회원 정보를 찾을 수 없습니다.');
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 코멘트 생성
router.post('/update', (req, res) => {
  try {
    const { comment, rate, beer_id, token } = req.body;
    if (token) {
      const decoded: any = jwt.verify(token, secret);
      console.log('decoded', decoded);
      const user_id = decoded.userId;
      // 유저가 코멘트를 남겼는지 확인
      Comment.findOrCreate({
        where: {
          user_id,
          beer_id,
        },
      }).then(([result, created]) => {
        if (created) {
          Comment.update(
            {
              rate,
              comment,
            },
            {
              where: {
                user_id,
                beer_id,
              },
            }
          ).then(() => AverageRate(beer_id).catch(() => res.sendStatus(500)));
          return res.status(201).send('등록 완료');
        } else {
          Comment.update(
            {
              rate,
              comment,
            },
            {
              where: {
                user_id,
                beer_id,
              },
            }
          )
            .then((data) => AverageRate(beer_id))
            .catch(() => res.sendStatus(500));
          return res.status(201).send('등록 완료');
        }
      });
    } else {
      return res.status(401).send('회원 정보를 찾을 수 없습니다.');
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 코멘트 삭제
router.post('/delete', async (req, res) => {
  try {
    const { token, beer_id } = req.body;
    // 깃북 아이디 받는 부분 없애기

    if (token) {
      const decoded: any = jwt.verify(token, secret);
      const user_id = decoded.userId;
      // 토큰이 있을때 토큰에서 찾은 유저 아이디와 삭제하려는 멘트의 유저 아이디가 일치
      if (user_id) {
        const deleteComment = await Comment.destroy({
          where: {
            user_id,
            beer_id,
          },
        }).catch((err) => res.sendStatus(500));
        if (deleteComment) {
          return res.status(201).send('코멘트 삭제');
        }
        return res.status(400).send('잘못 된 요청입니다.');
      }
      return res.status(403).send('삭제 권한이 없습니다.');
    } else {
      return res.status(401).send('회원 정보를 찾을 수 없습니다.');
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
