import DashboardHeader from "./components/DashboardHeader";
import CategorySection from "./components/CategorySection";
import useDashboardStore from "./store/dashboardStore";

export default function App() {
  const { data } = useDashboardStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">CNAPP Dashboard</h1>
        {data.categories.allIds.map((cid) => (
          <CategorySection key={cid} category={data.categories.byId[cid]} />
        ))}
      </main>
    </div>
  );
}
