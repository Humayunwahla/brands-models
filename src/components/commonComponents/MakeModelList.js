"use client";
import { useState, useEffect } from "react";
import { X, Car, Building2 } from "lucide-react";
import { deleteMakeModel } from "../../lib/dataManager";

export default function MakeModelList({ onClose }) {
  const [models, setModels] = useState([]);
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (model) => {
    const modelKey = model.modelId || `${model.name}-${model.makeId}`;
    if (
      window.confirm(
        `Are you sure you want to delete "${model.name}" from ${getMakeName(
          model.makeId
        )}?`
      )
    ) {
      setLoading(true);
      setDeletingId(modelKey);
      try {
        const updatedModels = await deleteMakeModel(model.modelId);
        setModels(updatedModels);
      } catch (error) {
        console.error("Error deleting model:", error);
        alert("Failed to delete model. Please try again.");
      } finally {
        setLoading(false);
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const modelsResponse = await fetch("/api/models");
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          setModels(modelsData);
        }
        const makesResponse = await fetch("/api/makes");
        if (makesResponse.ok) {
          const makesData = await makesResponse.json();
          setMakes(makesData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const getMakeName = (makeId) => {
    if (!makeId) return "";
    const make = makes.find((m) => m.makeId === makeId);
    return make ? make.name : "Unknown Make";
  };

  // Group models by make
  const modelsByMake = models.reduce((acc, model) => {
    const makeName = getMakeName(model.makeId);
    if (!acc[makeName]) {
      acc[makeName] = [];
    }
    acc[makeName].push(model);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Make Models List
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {models.length} model{models.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {/* Content */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 max-h-[60vh] sm:max-h-[60vh]">
          {models.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Car className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No models yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Start by adding your first model using the "Add Make Models"
                card.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(modelsByMake).map(([makeName, makeModels]) => (
                <div key={makeName} className="space-y-2 sm:space-y-3">
                  {/* Make Header */}
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {makeName}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({makeModels.length} model
                      {makeModels.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  {/* Models for this make */}
                  <div className="space-y-1 sm:space-y-2 ml-4 sm:ml-6">
                    {makeModels.map((model, index) => {
                      const modelKey =
                        model.modelId ||
                        `${model.name}-${model.makeId}` ||
                        index;
                      return (
                        <div
                          key={modelKey}
                          className="group flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg sm:rounded-xl transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-sm gap-2 sm:gap-0"
                        >
                          <div className="flex-1 flex items-center space-x-2 sm:space-x-3 w-full">
                            {model.displayImg && (
                              <img
                                src={model.displayImg}
                                alt={model.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded"
                              />
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                {model.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Model ID: {model.modelId}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(model)}
                            disabled={loading || deletingId === modelKey}
                            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                            aria-label={`Delete ${model.name}`}
                          >
                            <Car className="w-4 h-4" />
                            <span className="font-medium">
                              {deletingId === modelKey
                                ? "Deleting..."
                                : "Delete"}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 gap-2">
          <div className="text-xs sm:text-sm text-gray-600">
            Total: {models.length} model{models.length !== 1 ? "s" : ""} across{" "}
            {Object.keys(modelsByMake).length} make
            {Object.keys(modelsByMake).length !== 1 ? "s" : ""}
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
