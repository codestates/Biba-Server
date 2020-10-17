import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';

const router = express.Router();

// * GET /users/mypage

// * /users/checkEmail, 이메일 중복 체크

// * /users/checkNickname, 닉네임 중복 체크

// * POST /users/signup
// signup 비밀번호 유효성 확인 기능 추가하기

// * POST /users/login
router.post('/login', (req, res, next) => {
  // NOTE: 자주 발생하는 에러: 타입 추론이 any 로 되어있는 경우, 직접 적어주면 된다.
  const { email, password } = req.body;
  User.findOne({
    where: {
      email: email,
      password: password,
    },
  })
  .then((data: any) => {
    console.log('data: ', data);
    if (!data) {
      return res.status(404).send('unvalid user');
    } else {
      let token = jwt.sign({ data: email, useId: data.id}, 'secret_key');  // *
      res.status(200).json({ 
        userData: {
          id: data.id,
          nickname: data.nickname,
          // username: data.username, 
          // useremail: email,
        },
        token: token, 
      });
    }
  })
  .catch((err: any) => {
    res.status(404).send(err);
  })
});

// * POST /users/socialLogin/google
// * POST /users/socialLogin/kakao
// * POST /users/socialLogin/facebook

export = router;
