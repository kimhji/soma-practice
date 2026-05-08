import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MissionPage } from './pages/MissionPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mission/:missionId" element={<MissionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
