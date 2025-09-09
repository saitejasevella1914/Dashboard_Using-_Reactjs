import { useState, useEffect } from "react";
import { X } from "lucide-react";
import useDashboardStore from "../store/dashboardStore";

const TABS = [
  { key: "CSPM", label: "CSPM", catId: "c1" },
  { key: "CWPP", label: "CWPP", catId: "c2" },
  { key: "Image", label: "Image", catId: "c3" },
  { key: "Ticket", label: "Ticket", catId: "c4" }, // optional if not present
];

export default function SidebarWidgetSelector({ open, onClose }) {
  const { data, assignWidget } = useDashboardStore();
  const [activeTab, setActiveTab] = useState("CSPM");
  // selected holds user-changed values { [widgetId]: true|false }
  const [selected, setSelected] = useState({});

  // Reset selected when sidebar opens or activeTab changes
  useEffect(() => {
    setSelected({});
  }, [open, activeTab]);

  if (!open) return null;

  const tabInfo = TABS.find((t) => t.key === activeTab);
  const category = tabInfo ? data.categories.byId[tabInfo.catId] : null;

  // Show only widgets for the active category
  const widgets = category?.widgetIds?.map((id) => data.widgets.byId[id]) || [];

  // Determine whether checkbox is checked currently (consider user toggles stored in selected)
  const isChecked = (wid) => {
    if (selected.hasOwnProperty(wid)) return !!selected[wid];
    return false; // default unchecked
  };

  const toggle = (wid) => {
    setSelected((prev) => {
      // toggle checkbox state
      return { ...prev, [wid]: !prev[wid] };
    });
  };

  const handleConfirm = () => {
    if (!category) {
      onClose();
      return;
    }

    // Only delete widgets that were checked
    Object.keys(selected).forEach((wid) => {
      if (selected[wid]) {
        // true means checkbox checked => remove this widget from category
        assignWidget(category.id, wid, false);
      }
    });

    setSelected({});
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      {/* overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* sidebar */}
      <div className="w-full sm:w-[600px] bg-white h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-indigo-900 text-white">
          <h2 className="text-sm font-medium">Add Widget</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-2 text-sm ${
                activeTab === tab.key
                  ? "border-b-2 border-indigo-600 font-medium text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {tab.key}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {widgets.length === 0 ? (
            <p className="text-sm text-gray-500">No widgets available</p>
          ) : (
            widgets.map((w) => (
              <label key={w.id} className="flex items-center gap-3 py-3 border-b">
                <input
                  type="checkbox"
                  checked={isChecked(w.id)}
                  onChange={() => toggle(w.id)}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{w.name}</span>
                  {w.text && <span className="text-xs text-gray-500">{w.text}</span>}
                </div>
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 px-4 py-3 border-t">
          <button onClick={onClose} className="px-4 py-2 rounded-md border text-sm">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-indigo-900 text-white text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
