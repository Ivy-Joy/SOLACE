//lead application entry
// apps/app-frontend/app/apply/page.tsx
import Navbar from "@/src/components/navbar/Navbar";
import LeadApplicationForm from "@/src/components/lead/LeadApplicationForm";

export default function ApplyPage(){
  return (
    <>
      <Navbar />
      <main className="pt-24 container">
        <h1 className="text-3xl font-bold mb-4">Apply to Lead in SOLACE</h1>
        <LeadApplicationForm />
      </main>
    </>
  );
}