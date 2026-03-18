import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import Providers from "@/components/Providers";
import '@/app/globals.css';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </Providers>
  );
}
