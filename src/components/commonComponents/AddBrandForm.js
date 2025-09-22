import { useState, useEffect } from "react";
import { Building2, Plus, X, Check } from "lucide-react";
import { addBrand } from "../../lib/dataManager";

/**
 * AddBrandForm Component
 * Form for adding new powersports brands
 */
export default function AddBrandForm({ onCancel, onSuccess }) {
  const [brandName, setBrandName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingBrands, setExistingBrands] = useState([]);

  // Load existing brands from API
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await fetch("/api/save-data?type=brands");
        if (response.ok) {
          const brands = await response.json();
          setExistingBrands(brands);
        }
      } catch (error) {
        console.error("Error loading brands:", error);
      }
    };
    loadBrands();
  }, []);

  const validateBrandName = (name) => {
    if (!name.trim()) {
      return "Brand name is required";
    }
    if (name.trim().length < 2) {
      return "Brand name must be at least 2 characters long";
    }
    if (
      existingBrands.some(
        (brand) => brand.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      return "Brand name already exists";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateBrandName(brandName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newBrand = {
        name: brandName.trim(),
      };

      // Save to API
      const response = await fetch("/api/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "brands",
          data: [...existingBrands, newBrand],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save brand");
      }

      // Save to localStorage
      addBrand(newBrand);

      setSuccess(true);
      setBrandName("");

      // Auto-close and notify parent after 1.5 seconds
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess(newBrand);
        onCancel();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to add brand");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBrandName(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Add New Brand</h2>
              <p className="text-sm text-gray-500">
                Create a new powersports brand
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
          {/* Brand Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="brandName"
              className="block text-sm font-medium text-gray-700"
            >
              Brand Name *
            </label>
            <div className="relative">
              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={handleInputChange}
                placeholder="Enter brand name (e.g., Honda, Yamaha, Kawasaki)"
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                disabled={isLoading}
                autoFocus
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
                <span>Brand added successfully!</span>
              </p>
            )}
          </div>

          {/* Existing Brands Info */}
          {existingBrands.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Existing Brands ({existingBrands.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {existingBrands.slice(0, 6).map((brand) => (
                  <span
                    key={brand.id}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
                  >
                    {brand.name}
                  </span>
                ))}
                {existingBrands.length > 6 && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                    +{existingBrands.length - 6} more
                  </span>
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
              disabled={isLoading || !brandName.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Brand</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
