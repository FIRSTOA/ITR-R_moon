import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "퍼스트전산 ERP",
  description: "퍼스트전산 ERP 진행상황 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="min-w-0 flex-1 p-5">{children}</main>
        </div>
      </body>
    </html>
  );
}
