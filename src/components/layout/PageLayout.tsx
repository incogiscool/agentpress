import Navbar from "./Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar className="px-6 py-4" />
      <main className="px-6 py-12">{children}</main>
    </div>
  );
}
