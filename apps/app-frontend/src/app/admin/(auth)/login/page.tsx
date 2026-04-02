//Admin UI (Auth - register and login)
// apps/app-frontend/app/admin/(auth)/login/page.tsx
import Navbar from "@/src/components/navbar/Navbar";
import AdminAuthForm from "@/src/components/admin/AdminAuthForm";

export default function AdminLoginPage(){
  return (
    <>
      <Navbar />
      {/* <main className="pt-24 container">
        <AdminAuthForm />
      </main> */}
      <main className="min-h-screen flex items-center justify-center py-28 px-4">
        <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-100"><AdminAuthForm />
        </div>
      </main>
    </>
  );
}