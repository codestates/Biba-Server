import * as express from 'express';
import { Request, Response } from 'express'; // TODO: 설정하는 이유?

const router = express.Router();

/* GET users listing. */
router.get('/', function (req: Request, res: Response) {
  res.send('라우트 겟 요청 성공!');
});

// controllers/index.js 에 usersController 사용
const { usersController } = require('../controller');

// * POST /users/signin
router.post('/signin', usersController.signin.post);

export = router;

// NOTE: module.exports = router; 는 export = router; 로 설정하면 된다
// NOTE: 에러난 이유? exports 아니다. export 이다!
// export default router 도 된다.
// NOTE: 내보내기가 없는 모듈에서 가져오기 위해, "allowSyntheticDefaultImports": true 설정
// NOTE: 코드 * as 로 통일해서 사용(리펙토링해서 * 별추기)
