import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "BlogSpace",
  description: "Blog Management Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <Navbar />
          <div className="flex-1 pt-14">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
