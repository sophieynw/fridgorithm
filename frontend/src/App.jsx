// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import SignUp from './components/SignUp'; 
import ForgotPassword from './components/ForgotPassword';
import MainPage from './components/MainPage';
import ImageAnalysisTest from './components/ImageAnalysisTest'; // Added this line for testing VisionAI

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/image-test" element={<ImageAnalysisTest />} /> {/* Added this line for testing VisionAI */}
            </Routes>
        </Router>
    );
};

export default App;