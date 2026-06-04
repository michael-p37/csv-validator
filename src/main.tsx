import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router";

const router = createBrowserRouter(routes);
hydrateRoot(
  document.getElementById("root")!,
  <RouterProvider router={router} />
);