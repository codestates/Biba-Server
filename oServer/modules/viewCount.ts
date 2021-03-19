import ViewCount from '../models/viewCount';

const viewCount = (beer_id: string, user_id: number) => {
  ViewCount.findOrCreate({
    raw: true,
    where: {
      user_id,
      beer_id,
    },
  }).then(([data, created]) => {
    if (!created) {
      ViewCount.update(
        { count: data.count + 1 },
        { where: { user_id, beer_id } }
      );
    } else if (created) {
      ViewCount.update({ count: 1 }, { where: { user_id, beer_id } });
    }
  });
};

export default viewCount;
