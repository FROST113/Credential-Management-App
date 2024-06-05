import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import UserList from './components/UserList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/UserList" element={<UserList />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;