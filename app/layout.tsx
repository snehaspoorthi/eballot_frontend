import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "E-Ballot | Secure Digital Voting",
  description: "A secure, anonymous, and tamper-proof digital voting platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="pt-32">{children}</main>
      </body>
    </html>
  );
}
