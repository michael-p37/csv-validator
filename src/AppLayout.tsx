import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header>CSV Validator</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}