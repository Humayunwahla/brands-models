/**
 * Data Management Utilities
 * Handles local storage operations for brands and models
 */

// Storage keys
const STORAGE_KEYS = {
  BRANDS: "powersports_brands",
  MODELS: "powersports_models",
};

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {Array} - Array of items
 */
export const getFromStorage = (key) => {
  try {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return [];
  }
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {Array} data - Data to save
 */
export const saveToStorage = (key, data) => {
  try {
    if (typeof window === "undefined") return;

    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    throw new Error("Failed to save data");
  }
};

/**
 * Generate downloadable JSON file
 * @param {Array} data - Data to download
 * @param {string} filename - File name
 */
export const downloadAsJSON = (data, filename) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading JSON:", error);
    throw new Error("Failed to download file");
  }
};

// ===== BRAND OPERATIONS (localStorage only) =====

/**
 * Get all brands from localStorage
 * @returns {Array} - Array of brand objects
 */
export const getBrands = () => {
  return getFromStorage(STORAGE_KEYS.BRANDS);
};

/**
 * Add a new brand to localStorage
 * @param {Object} brand - Brand object {id, name, createdAt, updatedAt}
 * @returns {Array} - Updated brands array
 */
export const addBrand = (brand) => {
  try {
    const existingBrands = getBrands();

    // Check if brand already exists
    const exists = existingBrands.some(
      (existing) => existing.name.toLowerCase() === brand.name.toLowerCase()
    );

    if (exists) {
      throw new Error("Brand already exists");
    }

    const updatedBrands = [...existingBrands, brand];
    saveToStorage(STORAGE_KEYS.BRANDS, updatedBrands);

    return updatedBrands;
  } catch (error) {
    console.error("Error adding brand:", error);
    throw error;
  }
};

/**
 * Update an existing brand in localStorage
 * @param {string} brandId - Brand ID
 * @param {Object} updates - Updates to apply
 * @returns {Array} - Updated brands array
 */
export const updateBrand = (brandId, updates) => {
  try {
    const existingBrands = getBrands();
    const brandIndex = existingBrands.findIndex(
      (brand) => brand.id === brandId
    );

    if (brandIndex === -1) {
      throw new Error("Brand not found");
    }

    const updatedBrands = [...existingBrands];
    updatedBrands[brandIndex] = {
      ...updatedBrands[brandIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveToStorage(STORAGE_KEYS.BRANDS, updatedBrands);

    return updatedBrands;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};

/**
 * Delete a brand from localStorage
 * @param {string} brandId - Brand ID
 * @returns {Array} - Updated brands array
 */
export const deleteBrand = (brandId) => {
  try {
    const existingBrands = getBrands();
    const updatedBrands = existingBrands.filter(
      (brand) => brand.id !== brandId
    );

    saveToStorage(STORAGE_KEYS.BRANDS, updatedBrands);

    // Also remove models associated with this brand
    const existingModels = getModels();
    const updatedModels = existingModels.filter(
      (model) => model.brandId !== brandId
    );
    saveToStorage(STORAGE_KEYS.MODELS, updatedModels);

    return updatedBrands;
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};

// ===== MODEL OPERATIONS (localStorage only) =====

/**
 * Get all models from localStorage
 * @returns {Array} - Array of model objects
 */
export const getModels = () => {
  return getFromStorage(STORAGE_KEYS.MODELS);
};

/**
 * Get models by brand from localStorage
 * @param {string} brandId - Brand ID
 * @returns {Array} - Array of models for the brand
 */
export const getModelsByBrand = (brandId) => {
  const models = getModels();
  return models.filter((model) => model.brandId === brandId);
};

/**
 * Add a new model to localStorage
 * @param {Object} model - Model object {id, name, brandId, brandName, createdAt, updatedAt}
 * @returns {Array} - Updated models array
 */
export const addModel = (model) => {
  try {
    const existingModels = getModels();

    // Check if model already exists for this brand
    const exists = existingModels.some(
      (existing) =>
        existing.name.toLowerCase() === model.name.toLowerCase() &&
        existing.brandId === model.brandId
    );

    if (exists) {
      throw new Error("Model already exists for this brand");
    }

    const updatedModels = [...existingModels, model];
    saveToStorage(STORAGE_KEYS.MODELS, updatedModels);

    return updatedModels;
  } catch (error) {
    console.error("Error adding model:", error);
    throw error;
  }
};

/**
 * Update an existing model in localStorage
 * @param {string} modelId - Model ID
 * @param {Object} updates - Updates to apply
 * @returns {Array} - Updated models array
 */
export const updateModel = (modelId, updates) => {
  try {
    const existingModels = getModels();
    const modelIndex = existingModels.findIndex(
      (model) => model.id === modelId
    );

    if (modelIndex === -1) {
      throw new Error("Model not found");
    }

    const updatedModels = [...existingModels];
    updatedModels[modelIndex] = {
      ...updatedModels[modelIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveToStorage(STORAGE_KEYS.MODELS, updatedModels);

    return updatedModels;
  } catch (error) {
    console.error("Error updating model:", error);
    throw error;
  }
};

/**
 * Delete a model from localStorage
 * @param {string} modelId - Model ID
 * @returns {Array} - Updated models array
 */
export const deleteModel = (modelId) => {
  try {
    const existingModels = getModels();
    const updatedModels = existingModels.filter(
      (model) => model.id !== modelId
    );

    saveToStorage(STORAGE_KEYS.MODELS, updatedModels);

    return updatedModels;
  } catch (error) {
    console.error("Error deleting model:", error);
    throw error;
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Download brands as JSON file
 */
export const downloadBrands = () => {
  const brands = getBrands();
  const timestamp = new Date().toISOString().split("T")[0];
  downloadAsJSON(brands, `brands_${timestamp}.json`);
};

/**
 * Download models as JSON file
 */
export const downloadModels = () => {
  const models = getModels();
  const timestamp = new Date().toISOString().split("T")[0];
  downloadAsJSON(models, `models_${timestamp}.json`);
};

/**
 * Download all data as combined JSON file
 */
export const downloadAllData = () => {
  const brands = getBrands();
  const models = getModels();
  const allData = {
    brands,
    models,
    exportedAt: new Date().toISOString(),
  };

  const timestamp = new Date().toISOString().split("T")[0];
  downloadAsJSON(allData, `powersports_data_${timestamp}.json`);
};

/**
 * Clear all data (use with caution)
 */
export const clearAllData = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.BRANDS);
  localStorage.removeItem(STORAGE_KEYS.MODELS);
};

/**
 * Get statistics
 * @returns {Object} - Statistics object
 */
export const getStatistics = () => {
  const brands = getBrands();
  const models = getModels();

  const modelsByBrand = {};
  brands.forEach((brand) => {
    modelsByBrand[brand.name] = models.filter(
      (model) => model.brandId === brand.id
    ).length;
  });

  return {
    totalBrands: brands.length,
    totalModels: models.length,
    modelsByBrand,
    lastUpdated: new Date().toISOString(),
  };
};
