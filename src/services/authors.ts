import http from '../common/http';
import { Author } from '../common/interfaces';

/**
 * API | GET
 * rest api call to fetch all videos against authors
 */
export const getAuthors = (): Promise<Author[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as Author[]);
};

/**
 * API | POST
 * rest api call to add new video
 */
export const addAuthorVideo = (data: Author) => {
  return http.post<Author>("/authors", data)
};

export const updateAuthorVideo = (data: Author) => {
  return http.put<Author>(`/authors/${data.id}`, data)
};

/**
 * API | GET
 * rest api call to get video detail
 */
export const getAuthorVideoDetail = (id: number) => {
  return http.get<Author>(`/authors/${id}`);
}
