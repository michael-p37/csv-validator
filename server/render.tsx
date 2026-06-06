import { renderToString } from "react-dom/server";
import AppLayout from "../src/AppLayout";

export function render(url: string) {
  console.log("SSR URL:", url)
  return renderToString(<AppLayout />);
}