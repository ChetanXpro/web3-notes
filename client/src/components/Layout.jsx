import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="App h-screen">
      <Outlet />
    </main>
  );
};

export default Layout;
