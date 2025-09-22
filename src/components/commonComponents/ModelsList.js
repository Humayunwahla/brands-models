"use client";
import { useState, useEffect } from "react";
import { X, Car, Trash2, Building2 } from "lucide-react";
import { deleteModel } from "../../lib/dataManager";

export default function ModelsList({ onClose, onUpdate }) {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load brands
        const brandsResponse = await fetch("/api/save-data?type=brands");
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData);
        }

        // Load models
        const modelsResponse = await fetch("/api/save-data?type=models");
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          setModels(modelsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const getBrandName = (brandId) => {
    if (!brandId) return "";
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "";
  };

  const handleDelete = async (model) => {
    const brandName = model.brandName || model.brandId;
    const modelKey = model.id || `${model.name}-${brandName}`;

    if (
      window.confirm(
        `Are you sure you want to delete "${model.name}" from ${brandName}?`
      )
    ) {
      setLoading(true);
      setDeletingId(modelKey);
      try {
        // Filter out the specific model
        const updatedModels = models.filter((m) => {
          if (model.id) {
            return m.id !== model.id;
          } else {
            return !(
              m.name === model.name &&
              (m.brandName === brandName || m.brandId === brandName)
            );
          }
        });

        // Save to API
        const response = await fetch("/api/save-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "models",
            data: updatedModels,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete model");
        }

        // Update local state
        setModels(updatedModels);

        // Notify parent component
        if (onDataChange) onDataChange();
      } catch (error) {
        console.error("Error deleting model:", error);
        alert("Failed to delete model. Please try again.");
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

  // Group models by brand
  const modelsByBrand = models.reduce((acc, model) => {
    const brandName = model.brandName || "Unknown Brand";
    if (!acc[brandName]) {
      acc[brandName] = [];
    }
    acc[brandName].push(model);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Models List</h2>
              <p className="text-sm text-gray-600">
                {models.length} model{models.length !== 1 ? "s" : ""} total
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
          {models.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No models yet
              </h3>
              <p className="text-gray-600">
                Start by adding your first model using the "Add Models" card.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(modelsByBrand).map(([brandName, brandModels]) => (
                <div key={brandName} className="space-y-3">
                  {/* Brand Header */}
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">{brandName}</h3>
                    <span className="text-sm text-gray-500">
                      ({brandModels.length} model
                      {brandModels.length !== 1 ? "s" : ""})
                    </span>
                  </div>

                  {/* Models for this brand */}
                  <div className="space-y-2 ml-6">
                    {brandModels.map((model, index) => (
                      <div
                        key={
                          model.id ||
                          `${model.name}-${model.brandName || model.brandId}` ||
                          index
                        }
                        className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {model.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Model in{" "}
                            {model.brandName ||
                              getBrandName(model.brandId) ||
                              "Unknown Brand"}{" "}
                            lineup
                          </p>
                        </div>

                        <button
                          onClick={() => handleDelete(model)}
                          disabled={
                            loading ||
                            deletingId ===
                              (model.id ||
                                `${model.name}-${
                                  model.brandName || model.brandId
                                }`)
                          }
                          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {deletingId ===
                            (model.id ||
                              `${model.name}-${
                                model.brandName || model.brandId
                              }`)
                              ? "Deleting..."
                              : "Delete"}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Total: {models.length} model{models.length !== 1 ? "s" : ""} across{" "}
            {Object.keys(modelsByBrand).length} brand
            {Object.keys(modelsByBrand).length !== 1 ? "s" : ""}
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
