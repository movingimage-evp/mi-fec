import { getCategories } from './categories';
import { getAuthors } from './authors';
import { IProcessedVideo } from '../common/interfaces';

export const getVideos = (): Promise<IProcessedVideo[]> => {
  return Promise.all([getCategories(), getAuthors()]).then(([categories, authors]) => {
    // TODO: implement (Done)
    // combine authours videos and categories to get complete videos list.
    let videos: IProcessedVideo[] = [];
    authors.forEach((author) => {
      videos = videos.concat(
        author.videos.map(
          (video): IProcessedVideo => {
            return {
              id: video.id,
              name: video.name,
              author: {
                id: author.id,
                name: author.name,
              },
              categories: categories.filter((category) => video.catIds.includes(category.id)),
              formats: video.formats,
              releaseDate: video.releaseDate,
            };
          }
        )
      );
    });
    return videos;
  });
};
