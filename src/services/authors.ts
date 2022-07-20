import { IAuthorVideos } from '../common/interfaces';

export const getAuthors = (): Promise<IAuthorVideos[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as IAuthorVideos[]);
};
