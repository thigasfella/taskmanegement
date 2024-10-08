import type { Metadata } from "next";
import "./styles/styles_globals/globals.css"

export const metadata: Metadata = {
  title: "TaskManagement",
  description: "Generated by thigas",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
