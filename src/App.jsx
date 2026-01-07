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

export default function App() {

  return (
    <Box className="app-content">
      <AppNavbar />
      <Container maxWidth="xl" className="page-container">
        <Routes>
          <Route path="/" element={<AnimatedPage><Listings /></AnimatedPage>} />
          <Route path="/listings" element={<AnimatedPage><Listings /></AnimatedPage>} />
          <Route path="/deploy" element={<AnimatedPage><DeployAgreement /></AnimatedPage>} />
          <Route path="/property/:id" element={<AnimatedPage><PropertyDetails /></AnimatedPage>} />
          <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
          <Route path="/tenant-scoring" element={<AnimatedPage><TenantScoring /></AnimatedPage>} />
          <Route path="/magic-match" element={<AnimatedPage><MagicMatch /></AnimatedPage>} />
        </Routes>
      </Container>
    </Box>
  );
}
