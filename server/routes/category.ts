import * as express from 'express';
import * as Sequelize from 'sequelize';
import Beer from '../models/beers';
import ViewCount from '../models/viewCount';
import Beer_tag from '../models/beer_tag';
import Comment from '../models/comments';
import Tag from '../models/tags';

const router = express.Router();

// // 한 번도 방문한적 없는 (평점순으로)
// router.post('/recommend', async (req, res) => {
//   try {
//     const { user_id } = req.body;
//     if (user_id) {
//       //카운트 찾기
//       const allList = await ViewCount.findAll({
//         raw: true,
//         attributes: ['beer_id'],
//         where: {
//           user_id,
//         },
//       });
//       const arrList = allList.reduce((acc: number[], val) => {
//         let view = val['beer_id'];
//         acc.push(view);
//         return acc;
//       }, []);

//       const BeerList = await Beer.findAll({
//         limit: 10,
//         raw: true,
//         order: [['rate', 'DESC']],
//         attributes: ['id', 'beer_name', 'beer_img', 'rate'],
//         where: {
//           id: {
//             // 이것들을 포함하지 않는 | 반대로는 in
//             [Sequelize.Op.notIn]: arrList,
//           },
//         },
//       });

//       const sendBeerList = BeerList.map((data) =>
//         Object.assign(
//           {},
//           {
//             id: data.id,
//             beer_name: data.beer_name,
//             beer_img: data.beer_img,
//             rate: data.rate,
//           }
//         )
//       );
//       if (sendBeerList) {
//         return res.status(200).json(sendBeerList);
//       } else {
//         return res.status(400).json('리스트를 찾을 수 없습니다.');
//       }
//     } else {
//       return res.status(401).send('유저 정보를 찾을 수 없습니다.');
//     }
//   } catch (e) {
//     return res.sendStatus(500);
//   }
// });

// 최근 둘러본 맥주
router.post('/recommend', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (user_id) {
      //뷰카운트에 최근 방문한곳 순으로 20개
      const recentList = await ViewCount.findAll({
        raw: true,
        limit: 20,
        attributes: ['beer_id'],
        order: [['updatedAt', 'DESC']],
        where: {
          user_id,
        },
      });
      const recentListArr = recentList.reduce((acc: number[], val) => {
        let view = val['beer_id'];
        acc.push(view);
        return acc;
      }, []);

      //뷰카운트 많이 방문한 순으로 20개
      const manyVisitList = await ViewCount.findAll({
        raw: true,
        limit: 20,
        attributes: ['beer_id'],
        order: [['count', 'DESC']],
        where: {
          user_id,
        },
      });
      const manyVisitListArr = manyVisitList.reduce((acc: number[], val) => {
        let view = val['beer_id'];
        acc.push(view);
        return acc;
      }, []);

      // 코멘트 4점 이상 남긴 맥주들
      const highScoreList = await Comment.findAll({
        raw: true,
        limit: 20,
        attributes: ['beer_id'],
        order: [['rate', 'DESC']],
        where: {
          user_id,
        },
      });
      const highScoreListArr = highScoreList.reduce((acc: number[], val) => {
        let view = val['beer_id'];
        acc.push(view);
        return acc;
      }, []);

      function union(a: number[], b: number[]): number[] {
        var tmp: any = {},
          res: any = [];
        for (var i = 0; i < a.length; i++) tmp[a[i]] = 1;
        for (var i = 0; i < b.length; i++) tmp[b[i]] = 1;
        for (var k in tmp) res.push(k);
        return res;
      }

      const visitIntersect = union(recentListArr, manyVisitListArr);
      const manyVisitNrate = union(visitIntersect, highScoreListArr);

      //교집합을 가지고 있는 태그들 모두 찾기
      const findTags = await Beer_tag.findAll({
        raw: true,
        limit: 10,
        attributes: [],
        where: {
          beer_id: {
            [Sequelize.Op.in]: manyVisitNrate,
          },
        },
        include: {
          model: Tag,
          as: 'getTag',
          attributes: ['id'],
        },
      });

      const findTagsArr = findTags.reduce((acc: number[], val) => {
        let view = val['getTag.id'];
        acc.push(view);
        return acc;
      }, []);

      const tagIdList = await Tag.findAll({
        raw: true,
        attributes: ['id'],
        limit: 10,
        where: {
          id: {
            [Sequelize.Op.in]: findTagsArr,
          },
        },
        include: [
          {
            model: Beer_tag,
            as: 'getBeer_tag',
            attributes: [],
            order: [[{ model: Beer, as: 'getBeer' }, 'rate', 'DESC']],
            include: [
              {
                model: Beer,
                attributes: ['id', 'beer_name', 'beer_img', 'rate'],
                as: 'getBeer',
              },
            ],
          },
        ],
      });

      const recommendLisArr: number[] = tagIdList.reduce(
        (acc: number[], val) => {
          let view: any = val['getBeer_tag.getBeer.id'];
          acc.push(view);
          return acc;
        },
        []
      );
      // 배열의 중복 제거
      const recommendList = [...new Set(recommendLisArr)];

      const recommendBeerList = await Beer.findAll({
        limit: 12,
        raw: true,
        where: {
          id: {
            [Sequelize.Op.in]: recommendList,
          },
        },
        order: [['rate', 'DESC']],
        attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      });

      const sendRecommendBeerList = recommendBeerList.map((data) =>
        Object.assign(
          {},
          {
            id: data.id,
            beer_name: data.beer_name,
            beer_img: data.beer_img,
            rate: data.rate,
          }
        )
      );
      return res.status(200).json(sendRecommendBeerList);
    } else {
      return res.status(400).send('유저를 찾을 수 없습니다.');
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 많이 방문한 맥주
router.post('/many-visit', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (user_id) {
      const manyVisitList = await ViewCount.findAll({
        raw: true,
        limit: 10,
        attributes: ['beer_id'],
        order: [['count', 'DESC']],
        where: {
          user_id,
        },
      });
      const arrList = manyVisitList.reduce((acc: number[], val) => {
        let view = val['beer_id'];
        acc.push(view);
        return acc;
      }, []);

      const BeerList = await Beer.findAll({
        raw: true,
        attributes: ['id', 'beer_name', 'beer_img', 'rate'],
        where: {
          id: {
            [Sequelize.Op.in]: arrList,
          },
        },
      });
      const sendBeerList = BeerList.map((data) =>
        Object.assign(
          {},
          {
            id: data.id,
            beer_name: data.beer_name,
            beer_img: data.beer_img,
            rate: data.rate,
          }
        )
      );
      if (sendBeerList) {
        return res.status(200).json(sendBeerList);
      }
    } else {
      return res.status(401).send('유저 정보를 찾을 수 없습니다.');
    }
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 밀 맥주
router.get('/wheat', async (req, res) => {
  try {
    const BeerList = await Beer.findAll({
      limit: 10,
      raw: true,
      order: Sequelize.literal('rand()'),
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      where: {
        style_id: 7,
      },
    });

    const sendBeerList = BeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );
    if (sendBeerList) {
      return res.status(200).json(sendBeerList);
    }
    return res.status(400).json('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 독일 맥주
router.get('/germany', async (req, res) => {
  try {
    const germanyBeerList = await Beer.findAll({
      limit: 10,
      raw: true,
      order: Sequelize.literal('rand()'),
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      where: {
        country_id: 6,
      },
    });
    const sendgermanyBeerList = germanyBeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );
    if (sendgermanyBeerList) {
      return res.status(200).json(sendgermanyBeerList);
    }
    return res.status(400).json('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 최신 맥주
router.get('/recent', async (req, res) => {
  try {
    const recentBeerList = await Beer.findAll({
      raw: true,
      limit: 10,
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      order: [['createdAt', 'DESC']],
    });
    const sendrecentBeerList = recentBeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );

    if (sendrecentBeerList) {
      return res.status(200).json(sendrecentBeerList);
    }
    return res.status(404).send('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

// 인기 맥주
// rate 높은 순으로 정렬
// 최근 코멘트 우선순으로
// 10개 까지 랜덤하게 정렬
router.get('/popular', async (req, res) => {
  try {
    const popularBeerList = await Beer.findAll({
      limit: 10,
      // order: Sequelize.literal('rand()'),
      raw: true,
      attributes: ['id', 'beer_name', 'beer_img', 'rate'],
      where: {
        rate: {
          [Sequelize.Op.gte]: 4, // 'rate' >= 4
        },
      },
    });

    const sendpopularBeerList = popularBeerList.map((data) =>
      Object.assign(
        {},
        {
          id: data.id,
          beer_name: data.beer_name,
          beer_img: data.beer_img,
          rate: data.rate,
        }
      )
    );

    if (sendpopularBeerList) {
      return res.status(200).json(sendpopularBeerList);
    }
    return res.status(404).send('리스트를 찾을 수 없습니다.');
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default router;
