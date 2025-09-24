/**
 * Delete a make via API and also delete associated make models
 * @param {string} makeId - Make ID
 * @returns {Promise<Array>} - Updated makes array
 */
export const deleteMake = async (makeId) => {
  try {
    // Get all makes
    const makesRes = await fetch("/api/makes");
    const makes = makesRes.ok ? await makesRes.json() : [];
    const updatedMakes = makes.filter((make) => make.makeId !== makeId);
    // Save updated makes
    await fetch("/api/makes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMakes),
    });
    // Get all make models
    const modelsRes = await fetch("/api/models");
    const models = modelsRes.ok ? await modelsRes.json() : [];
    const updatedModels = models.filter((model) => model.makeId !== makeId);
    // Save updated models
    await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedModels),
    });
    return updatedMakes;
  } catch (error) {
    console.error("Error deleting make:", error);
    throw error;
  }
};

/**
 * Delete a make model via API
 * @param {string} modelId - Model ID
 * @returns {Promise<Array>} - Updated models array
 */
export const deleteMakeModel = async (modelId) => {
  try {
    // Get all make models
    const modelsRes = await fetch("/api/models");
    const models = modelsRes.ok ? await modelsRes.json() : [];
    const updatedModels = models.filter((model) => model.modelId !== modelId);
    // Save updated models
    await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedModels),
    });
    return updatedModels;
  } catch (error) {
    console.error("Error deleting make model:", error);
    throw error;
  }
};
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

// ===== MAKES OPERATIONS (API) =====

/**
 * Get all makes from API
 * @returns {Promise<Array>} - Array of make objects
 */
export const getMakes = async () => {
  try {
    const res = await fetch("/api/makes");
    if (!res.ok) throw new Error("Failed to fetch makes");
    return await res.json();
  } catch (error) {
    console.error("Error fetching makes:", error);
    return [];
  }
};

/**
 * Add a new make via API
 * @param {Object} make - { makeId, name, logo }
 * @returns {Promise<Object>} - Newly created make
 */
export const addMake = async (make) => {
  try {
    const res = await fetch("/api/makes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(make),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add make");
    return data;
  } catch (error) {
    console.error("Error adding make:", error);
    throw error;
  }
};

// ===== MAKE MODELS OPERATIONS (API) =====

/**
 * Get all models from API
 * @returns {Promise<Array>} - Array of model objects
 */
export const getMakeModels = async () => {
  try {
    const res = await fetch("/api/models");
    if (!res.ok) throw new Error("Failed to fetch models");
    return await res.json();
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};

/**
 * Add a new make model via API
 * @param {Object} model - { modelId, name, makeId, displayImg }
 * @returns {Promise<Object>} - Newly created model
 */
export const addMakeModel = async (model) => {
  try {
    const res = await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add model");
    return data;
  } catch (error) {
    console.error("Error adding model:", error);
    throw error;
  }
};
