import { create } from "zustand";
import { persist } from "zustand/middleware";

const emptyData = {
  widgets: {
    byId: {},
    allIds: [],
  },
  categories: {
    byId: {
      c1: { id: "c1", name: "CSPM Executive Dashboard", widgetIds: [] },
      c2: { id: "c2", name: "CWPP Dashboard", widgetIds: [] },
      c3: { id: "c3", name: "Registry Scan", widgetIds: [] },
    },
    allIds: ["c1", "c2", "c3"],
  },
};

const useDashboardStore = create(
  persist(
    (set) => ({
      data: emptyData,
      searchQuery: "",

      //search query
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Assign or unassign a widget from a single category.
      assignWidget: (categoryId, widgetId, checked) => {
        set((state) => {
          const cat = state.data.categories.byId[categoryId];
          if (!cat) return state;

          const widgetIdsSet = new Set(cat.widgetIds || []);
          if (checked) widgetIdsSet.add(widgetId);
          else widgetIdsSet.delete(widgetId);

          const updatedCat = { ...cat, widgetIds: [...widgetIdsSet] };

          return {
            data: {
              ...state.data,
              categories: {
                ...state.data.categories,
                byId: {
                  ...state.data.categories.byId,
                  [categoryId]: updatedCat,
                },
              },
            },
          };
        });
      },

      // Add a new user-created widget (detect chart type by category)
      addUserWidget: (categoryId, name, text, data = [], type = null) => {
        const id = `w_${Date.now()}`;
        set((state) => {
          const categoryName = state.data.categories.byId[categoryId]?.name;

          // Decide widget type if not explicitly provided
          let widgetType = type;
          if (!widgetType) {
            if (categoryName === "CWPP Dashboard") {
              widgetType = "bar";
            } else if (categoryName === "Registry Scan") {
              widgetType = "progress";
            } else if (categoryName === "CSPM Executive Dashboard") {
              widgetType = "donut";
            } else {
              widgetType = "donut"; // fallback
            }
          }

          const newWidget = {
            id,
            name,
            type: widgetType,
            data,
            text,
          };

          const widgets = { ...state.data.widgets.byId, [id]: newWidget };
          const allIds = [...state.data.widgets.allIds, id];
          const cat = state.data.categories.byId[categoryId];
          const updatedCat = { ...cat, widgetIds: [...(cat.widgetIds || []), id] };

          return {
            data: {
              ...state.data,
              widgets: { byId: widgets, allIds },
              categories: {
                ...state.data.categories,
                byId: {
                  ...state.data.categories.byId,
                  [categoryId]: updatedCat,
                },
              },
            },
          };
        });
      },

      // Remove widget from a category
      removeWidgetFromCategory: (categoryId, widgetId) => {
        set((state) => {
          const cat = state.data.categories.byId[categoryId];
          if (!cat) return state;

          const updatedCat = {
            ...cat,
            widgetIds: (cat.widgetIds || []).filter((id) => id !== widgetId),
          };

          // also remove widget completely from store
          const { [widgetId]: _, ...remainingWidgets } = state.data.widgets.byId;

          return {
            data: {
              ...state.data,
              widgets: {
                byId: remainingWidgets,
                allIds: state.data.widgets.allIds.filter((id) => id !== widgetId),
              },
              categories: {
                ...state.data.categories,
                byId: { ...state.data.categories.byId, [categoryId]: updatedCat },
              },
            },
          };
        });
      },
    }),
    {
      name: "dashboard-storage", // localStorage key
    }
  )
);

export default useDashboardStore;
