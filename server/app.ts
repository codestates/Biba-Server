//declare Express
import * as express from 'express';
import { Request, Response } from 'express';
import { sequelize } from './models';

//middleware
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

// import userRoutes
// import * as googleRouter from './routes/google'
import * as usersRouter from './routes/user';

// import beerRoutes
import beerRouter from './routes/beerList';
import tagRouter from './routes/tag';
import styleRouter from './routes/style';
import searchWord from './routes/search';
import commentRouter from './routes/comment';
import bookMarkRouter from './routes/bookmark';
import reportRouter from './routes/report';

const app = express();
const port = 4000;
dotenv.config();

//use middleware
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

// User Router
app.use('/users', usersRouter);
// app.use('/socials/google', googleRouter);

// Beer Router
app.use('/beer', beerRouter);
app.use('/tag', tagRouter);
app.use('/style', styleRouter);
app.use('/search', searchWord);
app.use('/comment', commentRouter);
app.use('/bookmark', bookMarkRouter);
app.use('/report', reportRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Success!');
});

app.get('/health', (req, res) => {
  console.log('Time:', Date());
  res.status(299).send('health check');
});

app.listen(port, () => {
  console.log(`connected port: ${port}`);
});
