import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATHS = {
  brands: path.join(DATA_DIR, "brands.json"),
  models: path.join(DATA_DIR, "models.json"),
};

/**
 * Ensure data directory exists
 */
const ensureDataDirectory = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating data directory:", error);
    throw error;
  }
};

/**
 * Write data to JSON file
 * @param {string} filePath - Path to JSON file
 * @param {Array} data - Data to save
 */
const writeToFile = (filePath, data) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to file (${filePath}):`, error);
    throw new Error("Failed to save data to file");
  }
};

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (!type || !data) {
      return Response.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    if (!FILE_PATHS[type]) {
      return Response.json({ error: "Invalid data type" }, { status: 400 });
    }

    writeToFile(FILE_PATHS[type], data);

    return Response.json({
      success: true,
      message: `${type} data saved successfully`,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    return Response.json({ error: "Failed to save data" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || !FILE_PATHS[type]) {
      return Response.json(
        { error: "Invalid or missing data type" },
        { status: 400 }
      );
    }

    const filePath = FILE_PATHS[type];

    if (!fs.existsSync(filePath)) {
      // Create file with empty array if it doesn't exist
      writeToFile(filePath, []);
      return Response.json([]);
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    return Response.json(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return Response.json({ error: "Failed to read data" }, { status: 500 });
  }
}
