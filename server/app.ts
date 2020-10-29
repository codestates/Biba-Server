//declare Express
import * as express from 'express';
import * as session from 'express-session'
import { Request, Response } from 'express';
import { sequelize } from './models';
import * as passport from 'passport';
import * as google from 'passport-google-oauth';
import * as chalk from 'chalk'
import { createProxyMiddleware } from 'http-proxy-middleware';
import User from './models/user';
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

const app = express();
const port = 4000;
dotenv.config();
let user = {};

//use middleware
app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: true,
  // cookie: {	
  //   httpOnly: true,
  //   secure: true
  // }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // TODO: true 사용 이유?

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
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // 쿠키사용시 설정
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);
// app.use('/auth', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }))


// passport google
passport.serializeUser((user, cb) => { // Strategy 성공 시 호출됨
  cb(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, cb) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  cb(null, user); // 여기의 user가 req.user가 됨
});

passport.use(new google.OAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: "http://localhost:4000/auth/google/callback",
}, 
function(
  accessToken: string,
  refreshToken: string,
  profile: google.Profile,
  cb
) {
  // id, name, email, nickname
  console.log(chalk.blue(JSON.stringify(profile)))
  // User.findOrCreate({ where: email }
  user = { ...profile }
  return cb(null, profile)
}
)
);

// google router
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google'),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("res",res)
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

app.get('/auth', (req: Request, res: Response) => {
  let sess: any = req.session
  console.log(sess.user_id)
  if (sess.user_id) {
    User.findOne({
      where: {
        id: sess.user_id
      },
    })
      .then((data: any) => {
        if (data) {
          let token = jwt.sign(
            { data: data.email, userId: data.id },
            process.env.JWT!
          );
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
          return res.status(404).send('');
        }
      })
      .catch((err: any) => {
        res.status(404).send(err);
      });
  } else if(sess.user_id === undefined) {
    res.status(400).send('인증 정보가 없습니다.')
  }
  
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('성공!')
})

app.get('/health', (req, res) => {
  console.log('Time:', Date());
  res.status(299).send('health check');
});

app.listen(port, () => {
  console.log(`connected port: ${port}`);
});
