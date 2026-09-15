import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBotWidget from "./components/ChatBotWidget";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CutoffPredictor from "./pages/CutoffPredictor";
import FindColleges from "./pages/FindColleges";
import CollegeDetail from "./pages/CollegeDetail";
import CompareColleges from "./pages/CompareColleges";
import Recommendations from "./pages/Recommendations";
import AICounselor from "./pages/AICounselor";
import Profile from "./pages/Profile";
import DataSources from "./pages/DataSources";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#FAF7F8] text-[#372B2E] antialiased selection:bg-[#F8D7DE] selection:text-[#B83B60]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/cutoff-predictor" element={<CutoffPredictor />} />
              <Route path="/colleges" element={<FindColleges />} />
              <Route path="/colleges/:id" element={<CollegeDetail />} />
              <Route path="/compare" element={<CompareColleges />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/counselor" element={<AICounselor />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/sources" element={<DataSources />} />
            </Routes>
          </main>
          <ChatBotWidget />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
