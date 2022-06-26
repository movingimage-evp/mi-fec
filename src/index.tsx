import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { AddVideo } from './components/add-videos';
import { VideosTable } from './components/videos-table';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} >
                <Route path="/" element={<VideosTable />} />
                <Route path="add-video" element={<AddVideo />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
