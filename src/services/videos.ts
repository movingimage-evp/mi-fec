import { getCategories } from './categories';
import { addAuthorVideo, deleteAuthorVideo, getAuthors, getAuthorVideoDetail } from './authors';
import { Author, ProcessedVideo } from '../common/interfaces';

/**
 * To get videos against authors
 */
export const getVideos = (): Promise<ProcessedVideo[]> => {

  return Promise
    .all([getCategories(), getAuthors()])
    .then(([categories, authors]) => {

      let processedVideos: ProcessedVideo[] = [];
      authors.forEach(author => {
        author.videos.forEach(video => {

          const filteredVideoCategories = categories.filter(category => video.catIds.includes(category.id));
          const videoCategoryNames = filteredVideoCategories.map(vc => vc.name);

          processedVideos.push({
            id: author.id,
            name: video.name,
            author: author.name,
            categories: videoCategoryNames
          });

        });
      });

      return processedVideos;
    });
}

/**
 * To get all categories
 */
export const getCategoriesAndAuthors = (): Promise<any> => {

  return Promise
    .all([getCategories(), getAuthors()])
    .then(([categories, authors]) => {

      return { categories, authors };
    });
};

/**
 * To add video against author
 */
export const addVideo = (data: Author) => {
  return addAuthorVideo(data);
};

/**
 * To delete video against author
 * @returns 
 */
export const deleteVideo = (id: number) => {
  return deleteAuthorVideo(id);
};

/**
 * To get detail for video against author
 */
export const getVideoDetail = (id: number) => {
  return getAuthorVideoDetail(id);
}
