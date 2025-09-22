"use client";
import { useState, useEffect } from "react";
import { Building2, Car, Zap } from "lucide-react";
import AddBrandForm from "../../commonComponents/AddBrandForm";
import AddModelForm from "../../commonComponents/AddModelForm";
import BrandsList from "../../commonComponents/BrandsList";
import ModelsList from "../../commonComponents/ModelsList";
import { getBrands, getModels } from "../../../lib/dataManager";

export default function HomeMenu() {
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showModelForm, setShowModelForm] = useState(false);
  const [showBrandsList, setShowBrandsList] = useState(false);
  const [showModelsList, setShowModelsList] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  // Load initial data from localStorage
  useEffect(() => {
    setBrands(getBrands());
    setModels(getModels());
  }, []);

  // Refresh functions (called by forms and lists after data changes)
  const refreshBrands = () => {
    setBrands(getBrands());
  };

  const refreshModels = () => {
    setModels(getModels());
  };

  const refreshAllData = () => {
    setBrands(getBrands());
    setModels(getModels());
  };

  // Handle card clicks
  const handleBrandCardClick = () => {
    setShowBrandForm(true);
  };

  const handleModelCardClick = () => {
    setShowModelForm(true);
  };

  // Handle statistics clicks
  const handleBrandsStatsClick = () => {
    setShowBrandsList(true);
  };

  const handleModelsStatsClick = () => {
    setShowModelsList(true);
  };

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%,rgba(68,68,68,.05))] bg-[length:20px_20px] opacity-20"></div>
      </div>

      <div className="relative min-h-screen px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              Powersports Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              Manage your powersports brands and models with ease
            </p>

            {/* Statistics */}
            {(brands.length > 0 || models.length > 0) && (
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
                <div
                  className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-lg"
                  onClick={handleBrandsStatsClick}
                  title="Click to view brands list"
                >
                  <Building2 className="w-4 h-4" />
                  <span>
                    {brands.length} Brand{brands.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div
                  className="flex items-center space-x-1 cursor-pointer hover:text-purple-600 transition-colors duration-200 hover:bg-purple-50 px-2 py-1 rounded-lg"
                  onClick={handleModelsStatsClick}
                  title="Click to view models list"
                >
                  <Car className="w-4 h-4" />
                  <span>
                    {models.length} Model{models.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-6 lg:gap-8 xl:gap-10 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {/* Add Brands Card */}
            <div
              className="group relative w-full"
              onClick={handleBrandCardClick}
            >
              <div className="relative bg-slate-100 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg group-hover:shadow-2xl transform transition-all duration-300 group-hover:scale-101 lg:group-hover:scale-101 cursor-pointer border border-slate-200 group-hover:border-blue-200/50">
                {/* Icon Container */}
                <div className="flex justify-center mb-3 sm:mb-4 md:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white drop-shadow-sm" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-2 md:mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    Add Brands
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-5 leading-relaxed px-2 sm:px-0">
                    Create and manage powersports brands. Add new manufacturers,
                    update existing ones, and organize your brand portfolio.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Models Card */}
            <div
              className="group relative w-full"
              onClick={handleModelCardClick}
            >
              <div className="relative bg-slate-100 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg group-hover:shadow-2xl transform transition-all duration-300 group-hover:scale-101 lg:group-hover:scale-101 cursor-pointer border border-slate-200 group-hover:border-purple-200/50">
                {/* Icon Container */}
                <div className="flex justify-center mb-3 sm:mb-4 md:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-200 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white drop-shadow-sm" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-2 md:mb-3 group-hover:text-purple-600 transition-colors duration-300 leading-tight">
                    Add Models
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-5 leading-relaxed px-2 sm:px-0">
                    Create and manage vehicle models. Add specifications,
                    features, and organize models under their respective brands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showBrandForm && (
        <AddBrandForm
          onCancel={() => setShowBrandForm(false)}
          onSuccess={() => {
            setShowBrandForm(false);
            refreshBrands();
          }}
        />
      )}

      {showModelForm && (
        <AddModelForm
          onCancel={() => setShowModelForm(false)}
          onSuccess={() => {
            setShowModelForm(false);
            refreshModels();
          }}
        />
      )}

      {/* Lists */}
      {showBrandsList && (
        <BrandsList
          onClose={() => setShowBrandsList(false)}
          onDataChange={refreshAllData}
        />
      )}

      {showModelsList && (
        <ModelsList
          onClose={() => setShowModelsList(false)}
          onDataChange={refreshModels}
        />
      )}
    </section>
  );
}
