import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { MangeVideo } from './components/manage-video';
import { VideosTable } from './components/videos-table';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} >
                <Route path="/" element={<VideosTable />} />
                <Route path="manage-video" element={<MangeVideo />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
