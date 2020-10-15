import { Request, Response } from 'express';
// TODO: 아래 import 로 설정하는 방법?
// 굳이 에러 안 나는데 고칠 필요없지 않나, 우선 전체 실행!!
// const { user } = require("../../models");
// TODO: 회원가입 관련 내용 ts 찾아보기!!!!
import user from '../../models';

// NOTE: ts: export function post 요청
export function post(req: Request, res: Response) {
    const { email, password } = req.body;
    
    user
    .findOne({
      where: {
        email: email,
        password: password,
      },
    })
    // TODO: ts 에서 .then()으로 받는 방법?
    .then((data: ) => {
      if (!data) {
        return res.status(404).send("unvalid user");
      } else {
        // username 과 useremail 을 반환한다.
        res.status(200).json({ username: data.username, useremail: email });
      }
    })
    // TODO: ts 에서 .then()으로 받는 방법?
    .catch((err: any) => {
      res.status(404).send(err);
    });
  },
};



/* ts 
import { Request, Response } from 'express';
// TODO: 모델 가져오기!
const { user } = require("../../models");

export function post(req: Request, res: Response) {
  res.send(`post send success!!`)
}
*/

/* js
module.exports = {
  post: (req, res) => {
    res.send(`post !!`);
  }
};
*/