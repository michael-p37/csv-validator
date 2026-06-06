import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { browserRouter } from "./browser-router";

hydrateRoot(document.getElementById("root")!, (
  <RouterProvider router={browserRouter} />
));
