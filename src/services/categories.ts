import type { Category } from '../common/interfaces';
import { getJson } from './http';

export const getCategories = async (): Promise<Category[]> => getJson<Category[]>('/categories');
