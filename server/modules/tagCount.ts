import Tag from '../models/tags';

const tagCount = (id: number) => {
  Tag.findOrCreate({
    raw: true,
    where: {
      id,
    },
  }).then(([data, created]) => {
    if (!created) {
      Tag.update({ count: data.count + 1 }, { where: { id } });
    } else {
      Tag.update({ count: 1 }, { where: { id } });
    }
  });
};

export default tagCount;
