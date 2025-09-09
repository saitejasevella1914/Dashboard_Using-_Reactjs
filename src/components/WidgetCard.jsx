import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { X } from "lucide-react";
import useDashboardStore from "../store/dashboardStore";

const COLORS = ["#3B82F6", "#EF4444", "#F59E0B", "#10B981"];

export default function WidgetCard({ widgetId, categoryId, categoryName }) {
  const { data, removeWidgetFromCategory } = useDashboardStore();
  const widget = data.widgets.byId[widgetId];

  if (!widget) return null;

  // Total calculation
  const total =
    Array.isArray(widget.data) && widget.data.length > 0
      ? widget.data.reduce((sum, d) => sum + d.value, 0)
      : 0;

  // SVG placeholders
  const SvgNoData = ({ type }) => {
    if (type === "donut") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 mb-2 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path d="M12 2 A10 10 0 0 1 22 12" strokeWidth="2" />
        </svg>
      );
    }
    if (type === "bar") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 mb-2 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <rect x="4" y="10" width="3" height="10" />
          <rect x="10" y="6" width="3" height="14" />
          <rect x="16" y="3" width="3" height="17" />
        </svg>
      );
    }
    if (type === "progress") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 mb-2 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <rect x="3" y="11" width="18" height="2" rx="1" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-4 relative h-[220px] flex flex-col">
      {/* Remove Button */}
      <button
        onClick={() => removeWidgetFromCategory(categoryId, widgetId)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-700 mb-2">{widget.name}</h3>

      {/* Registry Scan → Progress Bar */}
      {categoryName === "Registry Scan" ? (
        total > 0 ? (
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs font-medium text-gray-700 mb-1 text-center">
              Total ({total})
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
              {widget.data.map((d, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${(d.value / total) * 100}%`,
                    backgroundColor: COLORS[idx % COLORS.length],
                  }}
                  className="h-4"
                ></div>
              ))}
            </div>
            {/* Legends */}
            <div className="flex gap-4 text-xs mt-2 justify-center">
              {widget.data.map((d, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1"
                  style={{ color: COLORS[idx % COLORS.length] }}
                >
                  ● {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
            <SvgNoData type="progress" />
            No chart data
          </div>
        )
      ) : widget.type === "donut" ? (
        //CSPM Dashboard → Donut Pie Chart
        total > 0 ? (
          <div className="flex-1 flex items-center gap-4">
            {/* Left: Pie */}
            <div className="w-1/2 h-32 relative">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={widget.data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={55}
                  >
                    {widget.data.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-semibold text-gray-700">
                <span>Total</span>
                <span>{total}</span>
              </div>
            </div>

            {/* Right: Legends */}
            <div className="flex-1 space-y-1">
              {widget.data.map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-gray-600"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></span>
                  <span>{d.name}</span>
                  <span className="ml-auto font-medium">({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
            <SvgNoData type="donut" />
            No chart data available
          </div>
        )
      ) : categoryName === "CWPP Dashboard" ? (
        //CWPP Dashboard → Vertical Bar Chart
        total > 0 ? (
          <div className="flex-1 flex flex-col">
            <p className="text-xs font-medium text-gray-700 mb-1 text-center">
              Total ({total})
            </p>
            <ResponsiveContainer width="80%" height="100%">
              <BarChart data={widget.data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {widget.data.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
            <SvgNoData type="bar" />
            No chart data available
          </div>
        )
      ) : (
        // Default fallback
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
          <SvgNoData type="donut" />
          No chart data available
        </div>
      )}
    </div>
  );
}
