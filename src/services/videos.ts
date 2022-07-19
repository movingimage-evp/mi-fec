import { getCategories } from './categories';
import { getAuthors } from './authors';
import { ProcessedVideo } from '../common/interfaces';

export const getVideos = (): Promise<ProcessedVideo[]> => {
  return Promise
    .all([getCategories(),getAuthors()])
    .then(([categories, authors]) => {
    // TODO: implement (Done)
    // combine authours videos and categories to get complete videos list.
    let videos:ProcessedVideo[] = [];
    authors.forEach((author)=>{

      videos = videos.concat(author.videos.map((video):ProcessedVideo=>{
        return {
          id: video.id,
          name: video.name,
          author: author.name,
          authorId: author.id,
          categories: categories.filter((category)=> video.catIds.includes(category.id) ),
          formats: video.formats,
          releaseDate: video.releaseDate
        };
      }));

    });    
    return videos;
  });
};
