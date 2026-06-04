import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { ErrorPage } from "./pages/ErrorPage.js";
import { HomePage } from "./pages/HomePage.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}