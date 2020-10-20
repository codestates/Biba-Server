import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as usersRouter from './routes/user';
// import usersRouter from './routes/users'; // NOTE: 일반-> * as 변경하는 방법!
import { Request, Response } from 'express';

import { sequelize } from './models';

dotenv.config();
import beerRouter from './routes/beerList';
import tagRouter from './routes/tag';
import styleRouter from './routes/style';
import searchWord from './routes/search';
import commentRouter from './routes/comment';
import bookMarkRouter from './routes/bookmark';
import reportRouter from './routes/report';

const app = express();
const port = 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // TODO: true 사용 이유?

sequelize
  .sync({ force: false }) // NOTE: db 실행시 초기화 할건지?(true: 초기화)
  .then(() => {
    console.log('데이터 베이스 연결 성공');
  })
  .catch((err: Error) => {
    console.log('연결 실패', err);
  });

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/users', usersRouter);
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

app.listen(port, () => {
  console.log(`connected ${port}`);
});
