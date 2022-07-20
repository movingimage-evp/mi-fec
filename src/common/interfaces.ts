export interface ICategory {
  id: number;
  name: string;
}

export interface IVideo {
  id: number;
  catIds: number[];
  name: string;
  formats: IFormats;
  releaseDate: string;
}

export interface IAuthor {
  id: number;
  name: string;
}

export interface IAuthorVideos extends IAuthor {
  videos: IVideo[];
}

export interface IProcessedVideo {
  id: number;
  name: string;
  author: IAuthor; // using category object because: better to have value(id) and label together
  categories: ICategory[]; // using category object because: better to have value(id) and label together
  formats: IFormats;
  releaseDate: string;
}

export interface IFormats {
  [key: string]: IFormatData;
}

export interface IFormatData {
  res: string;
  size: number;
  name?: string; // name:optional because: it will be only used once change the Formats from onbject to  array for sorting
}
