import type { Metadata } from "next";
// font-related code removed for simplicity

export const metadata: Metadata = {
  title: "Bazar Market",
  description: "Redirection to Bazar Market",
  appleWebApp: {
    title: "Bazar Market",
    statusBarStyle: "default",
  },
  other: {
    "apple-itunes-app":
      "app-id=YOUR_APP_ID_IF_KNOWN, app-argument=https://web-customer.bazarmarket.kg",
  },
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
