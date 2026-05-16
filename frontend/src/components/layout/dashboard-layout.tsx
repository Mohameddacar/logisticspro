import Sidebar from './sidebar';
import Navbar from './navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="ml-64 p-10 lg:p-12">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
