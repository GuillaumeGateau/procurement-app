import type { Metadata } from "next";
import "../styles/globals.css";
import { AppLayout } from "@components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Macmillan Keck • Digital Economy Law & Strategy",
  description: "Partner-led counsel for telecom, digital finance, and data economy transformation.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}


