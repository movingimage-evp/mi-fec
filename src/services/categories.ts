import { ICategory } from '../common/interfaces';

export const getCategories = (): Promise<ICategory[]> => {
  return fetch(`${process.env.REACT_APP_API}/categories`).then((response) => (response.json() as unknown) as ICategory[]);
};
