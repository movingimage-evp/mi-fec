import React from 'react';
import { ProcessedVideo } from '../common/interfaces';
import styles from './videos-table.module.css';

interface VideosTableProps {
  videos: ProcessedVideo[];
}

export const VideosTable: React.FC<VideosTableProps> = ({ videos }) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.videosTable}>
        <thead>
          <tr>
            <th>Video Name</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody>
          {videos.map((video) => (
            <tr key={video.id}>
              <td>{video.name}</td>
              <td>{video.author}</td>
              <td>{video.categories.join(', ')}</td>
              <td> {/* add buttons here as needed */} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
