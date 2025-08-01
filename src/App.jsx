import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/homepage.jsx";
import ProfilePage from "./pages/profile.jsx";
import AuthPage from "./pages/authentication.jsx";
// import ContentPage from "./pages/contentpage.jsx";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:authId" element={<ProfilePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          {/* <Route path="/content/:id" element={<ContentPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}
