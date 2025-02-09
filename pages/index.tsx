import CRUDTable from "@/components/CRUDTable";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Next.js CRUD App</h1>
      <CRUDTable />
    </main>
  );
}
