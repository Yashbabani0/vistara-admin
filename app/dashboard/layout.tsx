import Header from "@/components/Header/Header";
import MobileMenu from "@/components/Sidebar/MobileMenu";
import PcSidebar from "@/components/Sidebar/PcSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <PcSidebar />
      <MobileMenu />
      <Header />
      {children}
    </div>
  );
}
