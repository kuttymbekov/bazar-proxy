import type { Metadata } from "next";
// font-related code removed for simplicity

export const metadata: Metadata = {
  title: "Bazar Market",
  description: "Redirection to Bazar Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
