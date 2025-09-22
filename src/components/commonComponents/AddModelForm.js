import { useState, useEffect } from "react";
import { Car, Plus, X, Check, ChevronDown } from "lucide-react";
import { addModel } from "../../lib/dataManager";

/**
 * AddModelForm Component
 * Form for adding new powersports models with brand association
 */
export default function AddModelForm({ onCancel, onSuccess }) {
  const [modelName, setModelName] = useState("");
  const [selectedBrandName, setSelectedBrandName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [existingModels, setExistingModels] = useState([]);
  const [brands, setBrands] = useState([]);

  // Load existing data from API
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
          setExistingModels(modelsData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const validateModel = (name, brandName) => {
    if (!name.trim()) {
      return "Model name is required";
    }
    if (name.trim().length < 2) {
      return "Model name must be at least 2 characters long";
    }
    if (!brandName) {
      return "Please select a brand";
    }

    // Check if model already exists for this brand
    const existsForBrand = existingModels.some(
      (model) =>
        model.name.toLowerCase() === name.trim().toLowerCase() &&
        model.brandName === brandName
    );
    if (existsForBrand) {
      return `Model "${name}" already exists for ${brandName}`;
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateModel(modelName, selectedBrandName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newModel = {
        name: modelName.trim(),
        brandName: selectedBrandName,
      };

      // Save to API
      const response = await fetch("/api/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "models",
          data: [...existingModels, newModel],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save model");
      }

      // Save to localStorage
      addModel(newModel);

      setSuccess(true);
      setModelName("");
      setSelectedBrandName("");

      // Auto-close and notify parent after 1.5 seconds
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess(newModel);
        onCancel();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to add model");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setModelName(e.target.value);
    if (error) setError("");
  };

  const handleBrandSelect = (brandName) => {
    setSelectedBrandName(brandName);
    setIsDropdownOpen(false);
    if (error) setError("");
  };

  const selectedBrand = brands.find((b) => b.name === selectedBrandName);

  // Group existing models by brand for display
  const modelsByBrand = existingModels.reduce((acc, model) => {
    if (!acc[model.brandName]) {
      acc[model.brandName] = [];
    }
    acc[model.brandName].push(model);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Add New Model</h2>
              <p className="text-sm text-gray-500">
                Create a new vehicle model
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close form"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Brand Selection */}
          <div className="space-y-2">
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700"
            >
              Brand *
            </label>
            {brands.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-700">
                  No brands available. Please add a brand first before creating
                  models.
                </p>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 flex items-center justify-between ${
                    error && !selectedBrandName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                  disabled={isLoading}
                >
                  <span
                    className={
                      selectedBrand ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {selectedBrand ? selectedBrand.name : "Select a brand"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <button
                        key={brand.name}
                        type="button"
                        onClick={() => handleBrandSelect(brand.name)}
                        className="w-full px-4 py-3 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Model Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="modelName"
              className="block text-sm font-medium text-gray-700"
            >
              Model Name *
            </label>
            <div className="relative">
              <input
                id="modelName"
                type="text"
                value={modelName}
                onChange={handleInputChange}
                placeholder="Enter model name (e.g., CBR600RR, YZF-R1, Ninja 650)"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  error
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isLoading || brands.length === 0}
                autoFocus={brands.length > 0}
              />
              {success && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                <span>{error}</span>
              </p>
            )}

            {/* Success Message */}
            {success && (
              <p className="text-sm text-green-600 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Model added successfully!</span>
              </p>
            )}
          </div>

          {/* Existing Models Info */}
          {Object.keys(modelsByBrand).length > 0 && (
            <div className="bg-purple-50 rounded-xl p-4 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-medium text-purple-800 mb-3">
                Existing Models ({existingModels.length})
              </h4>
              <div className="space-y-3">
                {Object.entries(modelsByBrand)
                  .slice(0, 3)
                  .map(([brandName, models]) => (
                    <div key={brandName}>
                      <h5 className="text-xs font-medium text-purple-700 mb-1">
                        {brandName}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {models.slice(0, 4).map((model) => (
                          <span
                            key={model.id}
                            className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg"
                          >
                            {model.name}
                          </span>
                        ))}
                        {models.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg">
                            +{models.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                {Object.keys(modelsByBrand).length > 3 && (
                  <p className="text-xs text-purple-600">
                    +{Object.keys(modelsByBrand).length - 3} more brands
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                !modelName.trim() ||
                !selectedBrandName ||
                brands.length === 0
              }
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Model</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
