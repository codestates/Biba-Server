//declare Express
import * as express from 'express';
import * as session from 'express-session';
import { Request, Response } from 'express';
import { sequelize } from './models';
import * as passport from 'passport';
import * as google from 'passport-google-oauth';
import * as chalk from 'chalk';
import User from './models/user';
import * as cookieParser from 'cookie-parser';
import * as github from 'passport-github';
const GitHubStrategy = github.Strategy;

//google.OAuth2Strategy;

//middleware
import * as jwt from 'jsonwebtoken';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

// import userRoutes
//import * as googleRouter from './routes/google'
import * as usersRouter from './routes/user';

// import beerRoutes
import beerRouter from './routes/beerList';
import tagRouter from './routes/tag';
import styleRouter from './routes/style';
import searchWord from './routes/search';
import commentRouter from './routes/comment';
import bookMarkRouter from './routes/bookmark';
import reportRouter from './routes/report';
import categoryRouter from './routes/category';
import Visitors from './models/visitors';
import { where } from 'sequelize/types';
import ViewCount from './models/viewCount';
import mobileRoutes from './routes/mobile';
import adminRouter from './routes/admin';

const app = express();
const port = 4000;
dotenv.config();
let user = {};
const secret = process.env.JWT!;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'https://beer4.xyz/auth/google/callback',
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: github.Profile,
      cb
    ) {
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

//use middleware
app.use(
  session({
    proxy: true,
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      path: '/',
      sameSite: 'none',
      httpOnly: true,
      maxAge: 60000 * 30, // 30분
      secure: true, //s 만 받으려면
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // TODO: true 사용 이유?
app.use(cookieParser());

//sequelize sync
sequelize
  .sync({ force: false }) // NOTE: db 실행시 초기화 할건지?(true: 초기화)
  .then(() => {
    console.log('데이터 베이스 연결 성공');
  })
  .catch((err: Error) => {
    console.log('연결 실패', err);
  });

//middleware

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://beer4.wyz',
      'https://beer4.wyz',
      'http://biba.website',
      'https://biba.website',
      'https://google.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // 쿠키사용시 설정
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Request-Headers',
      'Access-Control-Allow-Headers',
      'x-custom-header',
      'Content-Range',
    ],
  })
);
// app.use('/auth', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }))

// passport google
passport.serializeUser((user, cb) => {
  // Strategy 성공 시 호출됨
  cb(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, cb) => {
  // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  cb(null, user); // 여기의 user가 req.user가 됨
});

// google router
app.get(
  '/auth/google',
  passport.authenticate('github', { scope: ['profile'] })
);

app.get('/auth/google/callback', passport.authenticate('github'), function (
  req,
  res
) {
  // Successful authentication, redirect home.
  res.redirect('/login');
});

// User Router
app.use('/users', usersRouter);
//app.use('/socials/google', googleRouter);

// Beer Router
app.use('/beer', beerRouter);
app.use('/category', categoryRouter);
app.use('/tag', tagRouter);
app.use('/style', styleRouter);
app.use('/search', searchWord);
app.use('/comment', commentRouter);
app.use('/bookmark', bookMarkRouter);
app.use('/report', reportRouter);
app.use('/mobile', mobileRoutes);

// Admin Router
app.use('/admin', adminRouter);

app.get('/auth', (req: Request, res: Response) => {
  let sess: any = req.session;

  if (sess.user_id) {
    const decoded: any = jwt.verify(sess.user_id, secret);
    const user_id = decoded.userId;
    User.findOne({
      where: {
        id: user_id,
      },
    })
      .then((data: any) => {
        if (data) {
          res.status(200).json({
            userData: {
              id: data.id,
              email: data.email,
              nickname: data.nickname,
            },
            token: sess.user_id,
            profile: data.profile,
          });
        } else {
          return res.status(404).send('');
        }
      })
      .catch((err: any) => {
        res.status(500).send(err);
      });
  } else {
    let count = 0;
    if (req.cookies.count) {
      count = parseInt(req.cookies.count);
      res.cookie('count', '', { maxAge: 3600000 });
      let now = new Date();
      let date = now.getFullYear() + '/' + now.getMonth() + '/' + now.getDate();
      if (date !== req.cookies.countDate) {
        res.cookie('countDate', date, { maxAge: 86400000 });
      }
    } else {
      count = 0;
    }
    count = count + 1;
    Visitors.findOrCreate({
      raw: true,
      where: {
        id: 1,
      },
    }).then(([data, created]) => {
      if (!created) {
        Visitors.update(
          { totalVisit: data.totalVisit + 1 },
          { where: { id: 1 } }
        );
      } else if (created) {
        Visitors.update(
          { totalVisit: data.totalVisit + 1 },
          { where: { id: 1 } }
        );
      }
    });
    return res.status(404).send('인증 정보가 없습니다.');
  }
});

app.get('/count', async (req, res) => {
  const total = await Visitors.findOne({
    where: {
      id: 1,
    },
    raw: true,
  });
  if (total) {
    return res.status(200).json({
      totalVisits: total.totalVisit,
    });
  }
  return res.sendStatus(400);
});

app.get('/health', (req, res) => {
  console.log('Time:', Date());
  res.status(299).send('health check');
});

app.listen(port, () => {
  console.log(`connected port: ${port}`);
});
