"use client";
import { useState, useEffect } from "react";
import { X, Building2, Trash2 } from "lucide-react";
import { deleteBrand } from "../../lib/dataManager";

export default function BrandsList({ onClose, onUpdate }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Load brands from API
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await fetch("/api/save-data?type=brands");
        if (response.ok) {
          const brandsData = await response.json();
          setBrands(brandsData);
        }
      } catch (error) {
        console.error("Error loading brands:", error);
      }
    };
    loadBrands();
  }, []);

  const handleDelete = async (brand) => {
    if (
      window.confirm(
        `Are you sure you want to delete &quot;${brand.name}&quot;? This will also delete all associated models.`
      )
    ) {
      setLoading(true);
      setDeletingId(brand.name);
      try {
        // Delete brand from API
        const updatedBrands = brands.filter((b) => b.name !== brand.name);
        const response = await fetch("/api/save-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "brands",
            data: updatedBrands,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete brand");
        }

        // Also delete associated models from API
        const modelsResponse = await fetch("/api/save-data?type=models");
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          const updatedModels = modelsData.filter(
            (m) => m.brandName !== brand.name
          );

          await fetch("/api/save-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "models",
              data: updatedModels,
            }),
          });
        }

        // Update local state
        setBrands(updatedBrands);

        // Notify parent component
        if (onDataChange) onDataChange();
      } catch (error) {
        console.error("Error deleting brand:", error);
        alert("Failed to delete brand. Please try again.");
      } finally {
        setLoading(false);
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Brands List</h2>
              <p className="text-sm text-gray-600">
                {brands.length} brand{brands.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors duration-200 hover:shadow-md"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {brands.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No brands yet
              </h3>
              <p className="text-gray-600">
                Start by adding your first brand using the &quot;Add
                Brands&quot; card.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {brands.map((brand, index) => (
                <div
                  key={brand.name || brand.id || index}
                  className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Brand in your powersports collection
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(brand)}
                    disabled={loading || deletingId === brand.name}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {deletingId === brand.name ? "Deleting..." : "Delete"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Total: {brands.length} brand{brands.length !== 1 ? "s" : ""}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
