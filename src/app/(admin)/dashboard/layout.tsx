"use client";
import { Layout } from "antd";
import AdminFooter from "@/components/layout/admin.footer";
import AdminHeader from "@/components/layout/admin.header";
import AdminSidebar from "@/components/layout/admin.sidebar";
import AdminContent from "@/components/layout/admin.content";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <AdminSidebar />
      <Layout>
        <AdminHeader />

        <AdminContent>{children}</AdminContent>

        <AdminFooter />
      </Layout>
    </Layout>
  );
}
