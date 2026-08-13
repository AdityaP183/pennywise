import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";

import Budgets from "./pages/Budgets";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Authentication Pages */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* Protected Dashboard/App Pages */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Dashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Transactions />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/budgets"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Budgets />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/groups"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Groups />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Profile />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Root Fallback Redirect */}
                    <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
