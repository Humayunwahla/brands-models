"use client";
import { useState, useEffect } from "react";
import { X, Building2, Trash2 } from "lucide-react";
import { deleteMake } from "../../lib/dataManager";

export default function MakeList({ onClose }) {
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadMakes = async () => {
      try {
        const response = await fetch("/api/makes");
        if (response.ok) {
          const makesData = await response.json();
          setMakes(makesData);
        }
      } catch (error) {
        console.error("Error loading makes:", error);
      }
    };
    loadMakes();
  }, []);

  // Delete make
  const handleDelete = async (make) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${make.name}"? This will also delete all associated models.`
      )
    ) {
      setLoading(true);
      setDeletingId(make.makeId);
      try {
        const updatedMakes = await deleteMake(make.makeId);
        setMakes(updatedMakes);
      } catch (error) {
        console.error("Error deleting make:", error);
        alert("Failed to delete make. Please try again.");
      } finally {
        setLoading(false);
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Makes List
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {makes.length} make{makes.length !== 1 ? "s" : ""} total
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
          {makes.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No makes yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Start by adding your first make using the "Add Makes" card.
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {makes.map((make, index) => (
                <div
                  key={make.makeId || make.name || index}
                  className="group flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg sm:rounded-xl transition-all duration-200 border border-orange-200 hover:border-orange-300 hover:shadow-sm gap-2 sm:gap-0"
                >
                  <div className="flex-1 flex items-center space-x-2 sm:space-x-3 w-full">
                    {make.logo && (
                      <img
                        src={make.logo}
                        alt={make.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                        {make.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Make ID: {make.makeId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(make)}
                    disabled={loading || deletingId === make.makeId}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-100 sm:opacity-0 group-hover:opacity-100 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    aria-label={`Delete ${make.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">
                      {deletingId === make.makeId ? "Deleting..." : "Delete"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 gap-2">
          <div className="text-xs sm:text-sm text-gray-600">
            Total: {makes.length} make{makes.length !== 1 ? "s" : ""}
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
