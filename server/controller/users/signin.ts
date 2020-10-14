// module.exports = {
//   post: (req, res) => {
//     res.send(`post !!`);
//   }
// };

import { Request, Response } from 'express';

export function post(req: Request, res: Response) {
  res.send(`post send success!!`)
}