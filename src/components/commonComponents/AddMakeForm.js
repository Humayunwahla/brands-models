import { useState, useEffect } from "react";
import { Building2, X, Check } from "lucide-react";
import { addMake } from "../../lib/dataManager";

export default function AddMakeForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    makeId: "",
    name: "",
    logo: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingMakes, setExistingMakes] = useState([]);

  useEffect(() => {
    const loadMakes = async () => {
      try {
        const response = await fetch("/api/makes");
        if (response.ok) {
          const makes = await response.json();
          setExistingMakes(makes);
        }
      } catch (error) {
        console.error("Error loading makes:", error);
      }
    };
    loadMakes();
  }, []);

  const validateForm = () => {
    if (!formData.makeId.trim()) {
      return "Make ID is required";
    }
    if (!formData.name.trim()) {
      return "Make name is required";
    }
    if (formData.name.trim().length < 2) {
      return "Make name must be at least 2 characters long";
    }
    if (
      existingMakes.some(
        (make) => make.name.toLowerCase() === formData.name.trim().toLowerCase()
      )
    ) {
      return "Make name already exists";
    }
    if (existingMakes.some((make) => make.makeId === formData.makeId.trim())) {
      return "Make ID already exists";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const newMake = {
        makeId: formData.makeId.trim(),
        name: formData.name.trim(),
        logo: formData.logo.trim(),
      };
      await addMake(newMake);
      setSuccess(true);
      setFormData({ makeId: "", name: "", logo: "" });
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess(newMake);
        onCancel();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to add make");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all duration-300 scale-100 flex flex-col">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-100 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Add New Make
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Create a new powersports make
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Close form"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[70vh]"
        >
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="makeId"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Make ID *
            </label>
            <input
              id="makeId"
              name="makeId"
              type="text"
              value={formData.makeId}
              onChange={handleInputChange}
              placeholder="Enter unique make ID (e.g., honda, yamaha)"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
              }`}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="name"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Make Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter make name (e.g., Honda, Yamaha, Kawasaki)"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
              }`}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="logo"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Logo URL
            </label>
            <input
              id="logo"
              name="logo"
              type="url"
              value={formData.logo}
              onChange={handleInputChange}
              placeholder="Enter logo image URL (optional)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 bg-white"
              disabled={isLoading}
            />
            {formData.logo && (
              <div className="mt-2 flex items-center justify-center">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="max-h-12 sm:max-h-16 max-w-full object-contain rounded"
                />
              </div>
            )}
          </div>
          {error && (
            <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              <span>{error}</span>
            </p>
          )}
          {success && (
            <p className="text-xs sm:text-sm text-green-600 flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Make added successfully!</span>
            </p>
          )}
          {existingMakes.length > 0 && (
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-medium text-green-800 mb-2">
                Existing Makes ({existingMakes.length})
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {existingMakes.slice(0, 6).map((make) => (
                  <span
                    key={make.makeId}
                    className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg"
                  >
                    {make.name}
                  </span>
                ))}
                {existingMakes.length > 6 && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">
                    +{existingMakes.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:flex-1 px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading || !formData.makeId.trim() || !formData.name.trim()
              }
              className="w-full sm:flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? <span>Adding...</span> : <span>Add Make</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
