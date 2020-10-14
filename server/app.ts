//declare Express
import * as express from 'express';
import * as morgan from 'morgan';

const usersRouter = require('./routes/users');

const app = express();
const port = 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // TODO: true 사용한 이유?
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).send('Success!')
})

// Router
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`connected ${port}`);
})
