import React from "react";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const Layout = ({ children, className = "" }: LayoutProps) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-1 p-6 ${className}`}>
        {children}
      </div>
    </div>

  );
};

export default Layout;
