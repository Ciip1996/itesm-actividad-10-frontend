import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/organisms/AdminSidebar";
import "./AdminLayout.scss";

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-layout__content">
        <div className="admin-layout__container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};