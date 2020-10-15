import * as express from 'express';
import * as morgan from 'morgan';

import { sequelize } from './models';

const usersRouter = require('./routes/users');

const app = express();
const port = 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // TODO: true 사용한 이유?
// app.use(express.static(path.join(__dirname, 'public')));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터 베이스 연결 성공');
  })
  .catch((err: Error) => {
    console.log('연결 실패', err);
  });

app.get('/', (req, res) => {
  res.status(200).send('Success!');
});

// Router
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`connected ${port}`);
});
