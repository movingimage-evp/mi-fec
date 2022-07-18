export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  formats: Formats;
  releaseDate: string;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  categories: Category[]; // using category object because: better to have value(id) and label together
  authorId: number;  // using authorId to get author indentification.
  formats: Formats;
  releaseDate: string;
}


export interface Formats {
  [key: string]: FormatData
}

export interface FormatData {
  res: string, 
  size: number,
  name?: string, // name:optional because: it will be only used once change the Formats from onbject to  array for sorting 
}
