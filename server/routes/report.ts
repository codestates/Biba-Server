import * as express from 'express';
import Report from '../models/report';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

// 추천
router.post('/recommend', async (req, res) => {
  try {
    const { comment, token } = req.body;
    if (token) {
      const decoded: any = jwt.verify(token, 'secret_key');
      const user_id = decoded.userId;
      const recommendPost = await Report.create({
        comment,
        user_id: user_id,
        recommend: true,
        request: false,
      }).catch(() => res.sendStatus(500));
      if (recommendPost) {
        return res.status(201).send('요청 완료');
      }
      return res.status(400).send('잘못된 요청입니다.');
    }
    return res.status(401).send('회원 정보를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 등록 요청
router.post('/request', async (req, res) => {
  try {
    const { comment, token } = req.body;
    if (token) {
      const decoded: any = jwt.verify(token, 'secret_key');
      const user_id = decoded.userId;
      const recommendPost = await Report.create({
        comment,
        user_id: user_id,
        recommend: false,
        request: true,
      }).catch(() => res.sendStatus(500));
      if (recommendPost) {
        return res.status(201).send('요청 완료');
      }
      return res.status(400).send('잘못된 요청입니다.');
    }
    return res.status(401).send('회원 정보를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
