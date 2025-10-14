import React from "react";
import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import SubAdmins from "./pages/SubAdmins";
import SubAdminForm from "./pages/SubAdminForm";
import Login from "./pages/Login";
import { SubAdminProvider } from "./context/SubAdminContext";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <SubAdminProvider>
              <AdminLayout />
            </SubAdminProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="team" element={<Team />} />
        <Route path="sub-admins" element={<SubAdmins />} />
        <Route path="sub-admins/new" element={<SubAdminForm />} />
        <Route path="sub-admins/:id/edit" element={<SubAdminForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
