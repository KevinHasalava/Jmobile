import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Mobile Shop",
  description: "Mobile Shop Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0B0C10] text-[#E5E5E7]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
