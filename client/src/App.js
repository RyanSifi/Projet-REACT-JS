import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
