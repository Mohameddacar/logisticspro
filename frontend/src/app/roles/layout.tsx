import DashboardLayout from "@/components/layout/dashboard-layout";

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
