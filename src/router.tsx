import { LoginPage } from "./pages/LoginPage";
import { ErrorPage } from "./pages/ErrorPage";
import { UploadPage } from "./pages/UploadPage";
import { AdminPage } from "./pages/AdminPage";
import { CorrectionPage } from "./pages/CorrectionPage";
import AppLayout from "./AppLayout";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

export const routeObjects: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "upload", element: <UploadPage />},
      { path: "admin", element: <AdminPage />},
      { path: "correction", element: <CorrectionPage />},
    ],
  },
];