"use client";

import { useEffect, useState } from "react";
import { getValentines, deleteValentine } from "../actions";
import dynamic from "next/dynamic";
import { Trash2, Filter, Loader2 } from "lucide-react";

// Dynamic import for the PDF button to avoid build errors
const PdfDownloadButton = dynamic(() => import("./DownloadButton"), {
  ssr: false,
  loading: () => <span className="text-sm text-gray-400">Loading PDF engine...</span>,
});

const BUILDINGS = ["All Buildings", "Williams", "Geisert", "Harper", "Heitz/Singles", "University"];

interface Valentine {
  id: string;
  building: string;
  imageData: string;
  createdAt: Date;
}

export default function AdminPage() {
  const [data, setData] = useState<Valentine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Buildings");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const vals = await getValentines();
    // Prisma returns dates as objects, but over the wire they might be strings
    // depending on your version/setup, so we ensure standard behavior here if needed.
    setData(vals as any);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this card?")) return;

    setDeletingId(id);
    const result = await deleteValentine(id);

    if (result.success) {
      // Remove from local state immediately
      setData((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Failed to delete item");
    }
    setDeletingId(null);
  }

  // Filter the data based on selection
  const filteredData = filter === "All Buildings" ? data : data.filter((v) => v.building === filter);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-pink-500">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );

  return (
    <main className="min-h-screen p-8 bg-gray-50 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Total Cards: {data.length} {filter !== "All Buildings" && `(${filteredData.length} shown)`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* PDF Button (Only downloads what is currently filtered) */}
            {filteredData.length > 0 && <PdfDownloadButton data={filteredData} />}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <label className="font-medium text-sm text-gray-600">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2.5 outline-none"
          >
            {BUILDINGS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Data List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No valentines found for this filter.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Building</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((val) => (
                  <tr key={val.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">{new Date(val.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {val.building}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(val.id)}
                        disabled={deletingId === val.id}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                        title="Delete"
                      >
                        {deletingId === val.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
