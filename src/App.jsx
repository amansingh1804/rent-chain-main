import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Listings from "./pages/Listings";
import DeployAgreement from "./pages/DeployAgreement";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import AppNavbar from "./components/AppNavbar";
import TenantScoring from "./pages/TenantScoring";
import MagicMatch from "./pages/MagicMatch";
import AnimatedPage from "./components/AnimatedPage";
import './App.css';

import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequireAuth from "./components/RequireAuth";

export default function App() {

  return (
    <AuthProvider>
      <Box className="app-content">
        <AppNavbar />
        <Container maxWidth="xl" className="page-container">
          <Routes>
             <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
             <Route path="/signup" element={<AnimatedPage><Signup /></AnimatedPage>} />
             {/* Protected Routes */}
            <Route path="/" element={<RequireAuth><AnimatedPage><Listings /></AnimatedPage></RequireAuth>} />
            <Route path="/listings" element={<RequireAuth><AnimatedPage><Listings /></AnimatedPage></RequireAuth>} />
            <Route path="/deploy" element={<RequireAuth><AnimatedPage><DeployAgreement /></AnimatedPage></RequireAuth>} />
            <Route path="/property/:id" element={<RequireAuth><AnimatedPage><PropertyDetails /></AnimatedPage></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><AnimatedPage><Dashboard /></AnimatedPage></RequireAuth>} />
            <Route path="/tenant-scoring" element={<RequireAuth><AnimatedPage><TenantScoring /></AnimatedPage></RequireAuth>} />
            <Route path="/magic-match" element={<RequireAuth><AnimatedPage><MagicMatch /></AnimatedPage></RequireAuth>} />
          </Routes>
        </Container>
      </Box>
    </AuthProvider>
  );
}
