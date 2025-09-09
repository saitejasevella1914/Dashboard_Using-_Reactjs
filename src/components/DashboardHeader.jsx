import { Search, RefreshCcw } from "lucide-react";
import { useState } from "react";
import SidebarWidgetSelector from "./SidebarWidgetSelector";
import useDashboardStore from "../store/dashboardStore";

export default function DashboardHeader() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { setSearchQuery } = useDashboardStore();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Dashboard</span> &gt; V2
          </div>

          {/* Search bar */}
          <div className="flex-1 px-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring"
                placeholder="Search widgets..."
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg border bg-gray-100 hover:bg-gray-200"
              title="Refresh"
            >
              <RefreshCcw className="w-4 h-4 text-gray-600" />
            </button>

            <button
              onClick={() => setOpenSidebar(true)}
              className="px-3 py-1.5 bg-gray-100 border rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              + Add Widget
            </button>

            <select className="border rounded-lg text-sm px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 2 days</option>
            </select>
          </div>
        </div>
      </header>

      <SidebarWidgetSelector
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
    </>
  );
}
