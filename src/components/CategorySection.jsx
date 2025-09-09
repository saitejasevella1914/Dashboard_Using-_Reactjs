import { useState } from "react";
import WidgetCard from "./WidgetCard";
import AddWidgetModal from "./AddWidgetModal";
import useDashboardStore from "../store/dashboardStore";

export default function CategorySection({ category }) {
  const { data, searchQuery } = useDashboardStore();
  const [openModal, setOpenModal] = useState(false);

  // Filter widgets by search query
  const widgets = (category.widgetIds || [])
    .map((id) => data.widgets.byId[id])
    .filter((w) =>
      searchQuery
        ? w?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <section className="mb-8">
      {/* Category Title */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        {category.name}
      </h2>

      {/* Grid layout */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widgets */}
        {widgets.length > 0 ? (
          widgets.map((w) => (
            <WidgetCard
              key={w.id}
              widgetId={w.id}
              categoryId={category.id}
              categoryName={category.name}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center border rounded-lg p-6 text-gray-500">
            No data available
          </div>
        )}

        {/* Add Widget card (only if not searching) */}
        {searchQuery === "" && (
          <div
            onClick={() => setOpenModal(true)}
            className="flex items-center justify-center bg-white border-2 border-dashed rounded-lg shadow-sm p-4 h-[220px] cursor-pointer hover:bg-gray-50"
          >
            + Add Widget
          </div>
        )}
      </div>

      {/* Modal → now passing categoryId */}
      <AddWidgetModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        categoryId={category.id}
      />
    </section>
  );
}
