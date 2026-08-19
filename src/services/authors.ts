import type { Author } from '../common/interfaces';
import { getJson } from './http';

export const getAuthors = async (): Promise<Author[]> => getJson<Author[]>('/authors');
