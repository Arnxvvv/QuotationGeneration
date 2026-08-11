import "./globals.css";
import NavBar from "@/components/NavBar";
import { InventoryProvider } from "@/context/InventoryContext";

export const metadata = {
  title: "PC Quotation Builder",
  description: "Build custom PC quotations from your own inventory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem("theme");
                if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <InventoryProvider>
          <NavBar />
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </InventoryProvider>
      </body>
    </html>
  );
}


