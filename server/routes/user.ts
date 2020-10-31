//declare Express
import * as express from 'express';
import User from '../models/user';
import { Request, Response } from 'express';

//middleware
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AnyLengthString } from 'aws-sdk/clients/comprehend';
dotenv.config();

//multer,aws-sdk,s3 연동
const router = express.Router();
const dirPath = path.join(__dirname, '/../config/s3.json');
aws.config.loadFromPath(dirPath);

const today = () => {
  return (
    String(new Date().getFullYear()) +
    String(new Date().getMonth() + 1) +
    String(new Date().getDate()) +
    String(new Date().getHours()) +
    String(new Date().getMinutes())
  );
};

// location 타입에러 해결을 위한 file 설정
interface MulterRequest extends Request {
  file: any;
  files: any;
}

// aws s3 객체 생성 및 multer upload setting
const s3 = new aws.S3();
const upload = multer({
  limits: {
    fileSize: 1024 * 2000,
  },

  storage: multerS3({
    s3: s3,
    bucket: 'biba-user-profile',
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, today() + '.' + file.originalname.split('.').pop());
    },
  }),
});

// * POST /users/profile
// 선택한 사진을 s3에 업로드하며, aws rds 에 profile 에 location 을 저장한다.
router.post('/profile', upload.array('image'), (req, res) => {
  try {
    const { nickname } = req.body;
    const image = (req as MulterRequest).files;
    const lastImage = image.slice(image.length - 1)[0].location;

    User.findOne({
      where: { nickname },
    })
      .then(() => {
        User.update({ profile: lastImage }, { where: { nickname } });
        res.status(200).json({ profile: lastImage });
      })
      .catch(() => {
        res.status(500).send('DB 서버에 저장 실패!');
      });
  } catch (err) {
    res.status(400).send('이미지가 없습니다.');
  }
});

// * POST /users/profile/delete
// DB 의 profile 삭제 && s3 img 삭제
router.post('/profile/delete', function (req, res) {
  const {
    body: { nickname },
  } = req;

  User.findOne({
    where: { nickname },
  })
    .then((data) => {
      if (data) {
        console.log('data: ', data);
        let userProfileKey = data.profile.split('/')[3];
        s3.deleteObject(
          {
            Bucket: 'biba-user-profile',
            Key: userProfileKey,
          },
          function (err, data) {}
        );
        User.update({ profile: '' }, { where: { nickname } });
        return res.status(200).send('DB profile 삭제 성공');
      }
    })
    .catch(() => {
      res.status(500).send('삭제 실패!');
    });
});

// * POST /users/changeNickname , 닉네임 변경
router.post('/changenickname', (req, res) => {
  let { nickname, token } = req.body;
  // let token: any = req.headers.token;
  const decoded_data: any = jwt.verify(token, process.env.JWT!);

  User.findOne({
    where: { email: decoded_data.data },
  }).then((data: any) => {
    console.log('data.dataValues.nickname: ', data.dataValues.nickname);
    if (data.dataValues.nickname !== nickname) {
      User.update(
        { nickname: nickname },
        { where: { email: decoded_data.data } }
      )
        .then(() => {
          res.status(200).send('닉네임을 변경하였습니다.');
        })
        .catch(() => {
          res.status(400).send('서버가 요청의 구문을 인식하지 못했습니다.');
        });
    } else {
      res.status(409).send('닉네임 변경에 실패하셨습니다.');
    }
  });
});

// * POST /users/changePassword , 비밀번호 변경
router.post('/changepassword', (req, res) => {
  let { currentPassword, newPassword, token } = req.body;
  // let token: any = req.headers.token;

  const decoded_data: any = jwt.verify(token, process.env.JWT!);
  // const decoded_data: string | object = jwt.verify(token, 'secret_key');
  // console.log('decoded_data: ', decoded_data);

  // crypto: 단방향이며, 비번 변경시 비밀키는 동일하므로 항상 요청시 동일한 암호화된 비밀번호를 DB에서 확인할 수 있다.

  const saltedPassword = newPassword + process.env.SALT!;
  const hashPassword = crypto
    .createHmac('sha512', process.env.CRYPTO!)
    .update(saltedPassword)
    .digest('hex');
  console.log('비밀번호 변경 할 때 ::', hashPassword);

  User.findOne({
    where: { email: decoded_data.data },
  }).then((data: any) => {
    data.dataValues.password !== hashPassword
      ? User.update(
          { password: hashPassword },
          { where: { email: decoded_data.data } }
        )
          .then(() => {
            res.status(200).send('비밀번호 변경에 성공하셨습니다.');
          })
          .catch(() => {
            res.status(400).send('서버가 요청의 구문을 인식하지 못했습니다.');
          })
      : res.status(409).send('비밀번호 변경에 실패하셨습니다.');
  });
});

// * POST /users/checkemail, 이메일 중복 체크
router.post('/checkemail', (req, res) => {
  const { email } = req.body;

  User.findOne({
    where: { email },
  }).then((data: any) => {
    console.log('data: ', data);
    data
      ? res.status(409).send('존재하는 이메일 입니다.')
      : res.status(200).send('사용가능한 이메일 입니다.');
  });
});

// * POST /users/checknickname, 닉네임 중복 체크
router.post('/checknickname', (req, res) => {
  const { nickname } = req.body;

  User.findOne({
    where: { nickname },
  }).then((data: any) => {
    data
      ? res.status(409).send('존재하는 닉네임 입니다.')
      : res.status(200).send('사용가능한 닉네임 입니다.');
  });
});

// * POST /users/signup
// user 가 회원가입 했을 때, 회원정보를 db에 저장하도록 구현.
router.post('/signup', (req, res) => {
  const { email, nickname, password, passwordForCheck } = req.body;
  if (
    password === passwordForCheck &&
    password !== '' &&
    passwordForCheck !== ''
  ) {
    const saltedPassword = password + process.env.SALT!;
    const hashPassword = crypto
      .createHmac('sha512', process.env.CRYPTO!)
      .update(saltedPassword)
      .digest('hex');
    console.log('회원가입 할 때 ::', hashPassword);
    User.findOne({
      where: { email },
    })
      .then((data: any) => {
        data
          ? res.status(409).send('Already exist user')
          : User.create({
              email,
              nickname,
              password,
            }).then(() => {
              User.update({ password: hashPassword }, { where: { email } });
              res.status(200).send('성공적으로 회원가입 하셨습니다.');
            });
      })
      .catch(() => {
        res.status(404).send('비밀번호 입력을 동일하게 해주세요!');
      });
  } else {
    res
      .status(409)
      .send('비밀번호를 입력해 주시거나, 동일한 비밀번호를 입력해 주세요, ');
  }
});

// * POST /users/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const saltedPassword = password + process.env.SALT!;
  const hashPassword = crypto
    .createHmac('sha512', process.env.CRYPTO!)
    .update(saltedPassword)
    .digest('hex');
  const sess: any = req.session;

  User.findOne({
    where: {
      email: email,
      password: hashPassword,
    },
  })
    .then((data: any) => {
      if (data) {
        let token = jwt.sign(
          { data: email, userId: data.id },
          process.env.JWT!
        );
        sess.user_id = token;
        console.log('::::::::sess.user_id:::::::', sess.user_id);
        res.setHeader('set-cookie', token);
        res.status(200).json({
          userData: {
            id: data.id,
            email: data.email,
            nickname: data.nickname,
          },
          token: token,
          profile: data.profile,
        });
      } else {
        return res.status(404).send('invalid user');
      }
    })
    .catch((err: any) => {
      res.status(409).send(err);
    });
});

export = router;
