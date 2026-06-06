import { renderToString } from "react-dom/server";
import AppLayout from "../src/AppLayout";

export function render(url: string) {
  return renderToString(<AppLayout />);
}