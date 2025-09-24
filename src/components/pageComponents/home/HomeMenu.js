"use client";
import { useState, useEffect } from "react";
import { Building2, Car, Zap } from "lucide-react";
import AddMakeForm from "../../commonComponents/AddMakeForm";
import AddMakeModelForm from "../../commonComponents/AddMakeModelForm";
import MakeList from "../../commonComponents/MakeList";
import MakeModelList from "../../commonComponents/MakeModelList";

export default function HomeMenu() {
  const [showMakeForm, setShowMakeForm] = useState(false);
  const [showMakeModelForm, setShowMakeModelForm] = useState(false);
  const [showMakeList, setShowMakeList] = useState(false);
  const [showMakeModelList, setShowMakeModelList] = useState(false);
  const [makesCount, setMakesCount] = useState(0);
  const [makeModelsCount, setMakeModelsCount] = useState(0);

  // Fetch makes and make models count
  const fetchCounts = async () => {
    try {
      const makesRes = await fetch("/api/makes");
      const makes = makesRes.ok ? await makesRes.json() : [];
      setMakesCount(makes.length);
      const modelsRes = await fetch("/api/models");
      const makeModels = modelsRes.ok ? await modelsRes.json() : [];
      setMakeModelsCount(makeModels.length);
    } catch {
      setMakesCount(0);
      setMakeModelsCount(0);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleMakeCardClick = () => setShowMakeForm(true);
  const handleMakeModelCardClick = () => setShowMakeModelForm(true);

  const handleMakeStatsClick = () => {
    setShowMakeList(true);
  };

  const handleMakeModelStatsClick = () => {
    setShowMakeModelList(true);
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

            <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
              <div
                className="flex items-center space-x-1 cursor-pointer hover:text-green-600 transition-colors duration-200 hover:bg-green-50 px-2 py-1 rounded-lg"
                onClick={handleMakeStatsClick}
                title="Click to view makes list"
              >
                <Building2 className="w-4 h-4" />
                <span>
                  {makesCount} Make{makesCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div
                className="flex items-center space-x-1 cursor-pointer hover:text-orange-600 transition-colors duration-200 hover:bg-orange-50 px-2 py-1 rounded-lg"
                onClick={handleMakeModelStatsClick}
                title="Click to view make models list"
              >
                <Car className="w-4 h-4" />
                <span>
                  {makeModelsCount} Make Model
                  {makeModelsCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-6 lg:gap-8 xl:gap-10 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {/* Add Makes Card */}
            <div
              className="group relative w-full"
              onClick={handleMakeCardClick}
            >
              <div className="relative bg-slate-100 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg group-hover:shadow-2xl transform transition-all duration-300 group-hover:scale-101 cursor-pointer border border-slate-200 group-hover:border-green-200/50">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-green-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Building2 className="w-5 h-5 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                    Add Makes
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm lg:text-base mb-3 leading-relaxed px-2">
                    Create and manage makes. Add new makes, update existing
                    ones, and organize your make portfolio.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Makes Models Card */}
            <div
              className="group relative w-full"
              onClick={handleMakeModelCardClick}
            >
              <div className="relative bg-slate-100 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg group-hover:shadow-2xl transform transition-all duration-300 group-hover:scale-101 cursor-pointer border border-slate-200 group-hover:border-orange-200/50">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-orange-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Car className="w-5 h-5 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                    Add Makes Models
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm lg:text-base mb-3 leading-relaxed px-2">
                    Create and manage models for makes. Add new models, update
                    existing ones, and organize your make models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showMakeForm && (
        <AddMakeForm
          onCancel={() => {
            setShowMakeForm(false);
            fetchCounts();
          }}
          onSuccess={() => {
            setShowMakeForm(false);
            fetchCounts();
          }}
        />
      )}

      {showMakeModelForm && (
        <AddMakeModelForm
          onCancel={() => {
            setShowMakeModelForm(false);
            fetchCounts();
          }}
          onSuccess={() => {
            setShowMakeModelForm(false);
            fetchCounts();
          }}
        />
      )}

      {/* Lists */}

      {showMakeList && (
        <MakeList
          onClose={() => {
            setShowMakeList(false);
            fetchCounts();
          }}
        />
      )}

      {showMakeModelList && (
        <MakeModelList
          onClose={() => {
            setShowMakeModelList(false);
            fetchCounts();
          }}
        />
      )}
    </section>
  );
}
