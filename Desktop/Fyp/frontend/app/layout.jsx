// layout.jsx (stays server component)
import { SidebarProvider } from "@/components/sidebar-provider";
import LayoutContent from "@/components/layout-content";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </body>
    </html>
  );
}
