import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import AddAssignment from './pages/AddAssignment.jsx';
import Help from './pages/Help.jsx';
import StudyGuide from './pages/StudyGuide.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="add" element={<AddAssignment />} />
        <Route path="help" element={<Help />} />
        <Route path="guide/:id" element={<StudyGuide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
