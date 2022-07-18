import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { PATH } from './common/enums/path.enum';
import { Videos } from './components/video/videos';
import { Layout } from './components/public/layout';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path={PATH.MAIN} element={<Navigate to={PATH.VIDEOS} replace />} />
          <Route
            path={PATH.VIDEOS}
            element={
              <Layout>
                <Videos />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to={PATH.MAIN} replace />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
