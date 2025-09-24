import { useState, useEffect } from "react";
import { Car, X, Check } from "lucide-react";
import { addMakeModel } from "../../lib/dataManager";

export default function AddMakeModelForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    modelId: "",
    name: "",
    makeId: "",
    displayImg: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingModels, setExistingModels] = useState([]);
  const [makes, setMakes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const modelsRes = await fetch("/api/models");
        const makesRes = await fetch("/api/makes");
        if (modelsRes.ok) {
          setExistingModels(await modelsRes.json());
        }
        if (makesRes.ok) {
          setMakes(await makesRes.json());
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const validateForm = () => {
    if (!formData.modelId.trim()) {
      return "Model ID is required";
    }
    if (!formData.name.trim()) {
      return "Model name is required";
    }
    if (!formData.makeId.trim()) {
      return "Make ID is required";
    }
    if (
      existingModels.some((model) => model.modelId === formData.modelId.trim())
    ) {
      return "Model ID already exists";
    }
    if (
      existingModels.some(
        (model) =>
          model.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          model.makeId === formData.makeId.trim()
      )
    ) {
      return "Model name already exists for this make";
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
      const newModel = {
        modelId: formData.modelId.trim(),
        name: formData.name.trim(),
        makeId: formData.makeId.trim(),
        displayImg: formData.displayImg.trim(),
      };
      await addMakeModel(newModel);
      setSuccess(true);
      setFormData({ modelId: "", name: "", makeId: "", displayImg: "" });
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2  sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-100 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Add Make Model
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Create a new model for a make
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Close form"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto"
        >
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="modelId"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Model ID *
            </label>
            <input
              id="modelId"
              name="modelId"
              type="text"
              value={formData.modelId}
              onChange={handleInputChange}
              placeholder="Enter unique model ID"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
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
              Model Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter model name"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
              }`}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="makeId"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Make *
            </label>
            <select
              id="makeId"
              name="makeId"
              value={formData.makeId}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
              }`}
              disabled={isLoading}
            >
              <option value="">Select a make</option>
              {makes.map((make) => (
                <option key={make.makeId} value={make.makeId}>
                  {make.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="displayImg"
              className="block text-xs sm:text-sm font-medium text-gray-700"
            >
              Display Image URL
            </label>
            <input
              id="displayImg"
              name="displayImg"
              type="url"
              value={formData.displayImg}
              onChange={handleInputChange}
              placeholder="Enter image URL (optional)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300 bg-white"
              disabled={isLoading}
            />
            {formData.displayImg && (
              <div className="mt-2 flex items-center justify-center">
                <img
                  src={formData.displayImg}
                  alt="Model preview"
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
            <p className="text-xs sm:text-sm text-orange-600 flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Model added successfully!</span>
            </p>
          )}
          {existingModels.length > 0 && (
            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 max-h-24 sm:max-h-32 overflow-y-auto">
              <h4 className="text-xs sm:text-sm font-medium text-orange-800 mb-2">
                Existing Models ({existingModels.length})
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {existingModels.slice(0, 6).map((model, idx) => (
                  <span
                    key={model.modelId || `${model.name}-${idx}`}
                    className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg"
                  >
                    {model.name}
                  </span>
                ))}
                {existingModels.length > 6 && (
                  <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg">
                    +{existingModels.length - 6} more
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
                isLoading ||
                !formData.modelId.trim() ||
                !formData.name.trim() ||
                !formData.makeId.trim()
              }
              className="w-full sm:flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-yellow-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? <span>Adding...</span> : <span>Add Model</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
