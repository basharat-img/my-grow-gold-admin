import React from "react";
import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Login from "./pages/Login";
import AddTable from "./pages/AddTable";
import { RELATIVE_ROUTES, ROUTES } from "./config/routes";

const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path={RELATIVE_ROUTES.ANALYTICS} element={<Analytics />} />
        <Route path={RELATIVE_ROUTES.TEAM} element={<Team />} />
        <Route path={RELATIVE_ROUTES.ADD_TABLE} element={<AddTable />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default App;
