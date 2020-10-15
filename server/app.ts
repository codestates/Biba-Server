import * as express from 'express';
import { Request, Response } from 'express';
import * as morgan from 'morgan';
// import usersRouter from './routes/users'; // NOTE: 일반-> * as 변경하는 방법!
import * as usersRouter from './routes/users';

const app = express();
const port = 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // TODO: true 사용 이유?

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Success!');
});

// Router
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`connected ${port}`);
});
