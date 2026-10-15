import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "IT AS 관리",
  description: "퍼스트전산 IT AS 접수·분배·체크리스트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
