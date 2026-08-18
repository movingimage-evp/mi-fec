import { getCategories } from './categories';
import { getAuthors } from './authors';
import { ProcessedVideo } from '../common/interfaces';

export const getVideos = async (): Promise<ProcessedVideo[]> => {
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);

  const categoryNamesById = new Map(categories.map(({ id, name }) => [id, name]));

  return authors.flatMap((author) =>
    author.videos.map((video) => ({
      id: video.id,
      name: video.name,
      author: author.name,
      categories: video.catIds.map((catId) => categoryNamesById.get(catId)).filter((name): name is string => name !== undefined),
    }))
  );
};
