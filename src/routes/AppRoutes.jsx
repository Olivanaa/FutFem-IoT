import { createBrowserRouter } from "react-router-dom"
import Layout from "../pages/Layout"
import PaginaNaoEncontrada from "../pages/PaginaNaoEncontrada"
import PrivateRoute from "../services/Auth"
import Mapa from "../pages/Mapa"
import AdminLayout from "../pages/AdminLayout"
import AdminDashboard from "../pages/AdminDashboard"
import Quadra from "../pages/Quadra"
import Login from "../pages/Login"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <PaginaNaoEncontrada />,
        children: [
            {
                index: true,
                element: <Login />
            },
            {
                path: "mapa",
                element: <PrivateRoute requiredRole="user">
                    <Mapa />
                </PrivateRoute>
            },
            {
                path: "quadra/:id",
                element: <PrivateRoute requiredRole="user">
                    <Quadra />
                </PrivateRoute>
            },

        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                </PrivateRoute>
            },
        ]
    }
])