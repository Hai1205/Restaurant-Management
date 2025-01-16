"use client";
import React from "react";
import { Layout } from "antd";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { Content } = Layout;
  
  return (
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#ccc",
              borderRadius: "#ccc",
            }}
          >
            {children}
          </div>
        </Content>
  );
}
