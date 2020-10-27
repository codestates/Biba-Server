//declare Express
import * as express from 'express';
import User from '../models/user';

//middleware
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as aws from 'aws-sdk';
import * as path from 'path';

//multer,aws-sdk,s3 연동
const dirPath = path.join(__dirname, '/../config/s3.json');
aws.config.loadFromPath(dirPath);

const router = express.Router();

const today = () => {
  return (
    String(new Date().getFullYear()) +
    String(new Date().getMonth() + 1) +
    String(new Date().getDate()) +
    String(new Date().getHours()) +
    String(new Date().getMinutes())
  );
};
const s3 = new aws.S3();
const upload = multer({
  limits: {
    fileSize: 1024 * 2,
  },
  storage: multerS3({
    s3: s3,
    bucket: 'biba-user-profile',
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, today() + '.' + file.originalname.split('.').pop());
    }, // 유저 아이디 붙여서 +
  }),
});
router.post('/profile', upload.single('image'), async (req, res) => {
  const image = req.file;
  console.log(image);
  if (image === undefined) {
    return res.status(400).send('실패');
  }
  res.status(200).send('성공');
});

// * POST /users/changeNickname
router.post('/changenickname', (req, res) => {
  let { nickname, token } = req.body;
  // let token: any = req.headers.token;

  const decoded_data: any = jwt.verify(token, 'secret_key');

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

// * POST /users/changePassword
router.post('/changepassword', (req, res) => {
  let { currentPassword, newPassword, token } = req.body;
  // let token: any = req.headers.token;

  const decoded_data: any = jwt.verify(token, 'secret_key');
  // const decoded_data: string | object = jwt.verify(token, 'secret_key');
  // console.log('decoded_data: ', decoded_data);

  // crypto 적용
  // 단방향이며, 비번 변경시 비밀키는 동일하므로 항상 요청시 동일한 암호화된 비밀번호를 DB에서 확인할 수 있다.

  // const shasum = crypto.createHmac('sha512', 'crypto_secret_key');
  // shasum.update(newPassword);
  // newPassword = shasum.digest('hex');

  const hashPassword = crypto
    .createHmac('sha512', 'crypto_secret_key')
    .update(newPassword)
    .digest('hex');

  User.findOne({
    where: { email: decoded_data.data }, // TODO: string 설정을 제외하는 방법?
  }).then((data: any) => {
    // console.log('data: ', data);
    data.dataValues.password !== hashPassword
      ? // NOTE: User.update({password: '새로운 유저PW'}, {where: {userID: '유저ID'}})
        User.update(
          { password: hashPassword }, // 새로운 pass를 넣는다. // pk 는 업데이트 불가능
          { where: { email: decoded_data.data } } // 유저 email
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
// client 측에서 email 확인 버튼을 눌렀을 때, server 측에서 유효성 검사 후 send!
router.post('/checkemail', (req, res) => {
  const { email } = req.body;

  User.findOne({
    where: { email },
  })
    // TODO: any 말고 사용하는 방법? ts 찾아보기!
    .then((data: any) => {
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
  // catch
});

// * POST /users/signup
router.post('/signup', (req, res) => {
  // user 가 회원가입 했을 때, 회원정보를 db에 저장하도록 구현.
  const { email, nickname, password, passwordForCheck } = req.body;
  if (password === passwordForCheck) {
    const hashPassword = crypto
      .createHmac('sha512', 'crypto_secret_key')
      .update(password)
      .digest('hex');

    User.findOne({
      where: { email },
    }).then((data: any) => {
      data
        ? res.status(409).send('Already exist user')
        : User.create({
            email,
            nickname,
            password,
          }).then(() => {
            User.update({ password: hashPassword }, { where: { email } });
            res.status(200).send('성공적으로 로그인 하셨습니다.');
          });
    });
  }
  // res.status(404).send('비밀번호 입력을 동일하게 해주세요!');
});

// * POST /users/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const hashPassword = crypto
    .createHmac('sha512', 'crypto_secret_key')
    .update(password)
    .digest('hex');

  User.findOne({
    where: {
      email: email,
      // password: password // 삭제
    },
  })
    .then((data: any) => {
      User.update({ password: hashPassword }, { where: { email } }).then(() => {
        if (!data) {
          return res.status(404).send('invalid user');
        } else {
          let token = jwt.sign({ data: email, userId: data.id }, 'secret_key'); // *
          res.status(200).json({
            userData: {
              id: data.id,
              email: data.email,
              nickname: data.nickname,
            },
            token: token,
            profile: data.profile,
          });
        }
      });
    })
    .catch((err: any) => {
      res.status(404).send(err);
    });
});

export = router;
