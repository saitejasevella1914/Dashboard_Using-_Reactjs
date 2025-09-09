import { useState } from "react";
import { X } from "lucide-react";
import useDashboardStore from "../store/dashboardStore";

export default function AddWidgetModal({ open, onClose, categoryId }) {
  const { data, addUserWidget } = useDashboardStore();

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rawData, setRawData] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    if (!name.trim()) {
      alert("Please enter a widget name");
      return;
    }

    let chartData = [];
    try {
      chartData = rawData ? JSON.parse(rawData) : [];
      if (!Array.isArray(chartData)) throw new Error();
    } catch (err) {
      alert("Invalid JSON format. Please provide an array of { name, value } objects.");
      return;
    }

    // Detect category type
    const categoryName = data.categories.byId[categoryId]?.name;
    let widgetType = "donut"; // default

    if (categoryName === "CWPP Dashboard") {
      widgetType = "bar";
    } else if (categoryName === "Registry Scan") {
      widgetType = "progress";
    } else if (categoryName === "CSPM Executive Dashboard") {
      widgetType = "donut";
    }

    // Add widget
    addUserWidget(categoryId, name.trim(), text.trim(), chartData, widgetType);

    // Reset fields
    setName("");
    setText("");
    setRawData("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-indigo-900 text-white">
          <h2 className="text-sm font-medium">Add Widget</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Widget Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Widget Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <textarea
            className="w-full border rounded px-3 py-2 text-sm h-28"
            placeholder='Enter chart data as JSON, e.g. 
[{"name": "Passed", "value": 10}, {"name": "Failed", "value": 5}]'
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
          />
        </div>

        {/* Actions */}
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
