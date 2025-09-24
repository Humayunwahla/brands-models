import { promises as fs } from "fs";
import path from "path";

const MODELS_PATH = path.join(process.cwd(), "data", "modelMake.json");

export async function GET() {
  try {
    const data = await fs.readFile(MODELS_PATH, "utf-8");
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // If body is an array, replace the file (delete/update operation)
    if (Array.isArray(body)) {
      await fs.writeFile(MODELS_PATH, JSON.stringify(body, null, 2));
      return new Response(JSON.stringify(body), { status: 200 });
    }
    // Otherwise, treat as add operation
    const { modelId, name, makeId, displayImg } = body;
    if (!modelId || !name || !makeId) {
      return new Response(
        JSON.stringify({ error: "modelId, name, and makeId are required" }),
        { status: 400 }
      );
    }
    let models = [];
    try {
      const file = await fs.readFile(MODELS_PATH, "utf-8");
      models = JSON.parse(file);
    } catch {
      models = [];
    }
    if (models.some((m) => m.modelId === modelId)) {
      return new Response(
        JSON.stringify({ error: "Model ID already exists" }),
        { status: 400 }
      );
    }
    if (
      models.some(
        (m) =>
          m.name.toLowerCase() === name.toLowerCase() && m.makeId === makeId
      )
    ) {
      return new Response(
        JSON.stringify({ error: "Model name already exists for this make" }),
        { status: 400 }
      );
    }
    const newModel = { modelId, name, makeId, displayImg };
    models.push(newModel);
    await fs.writeFile(MODELS_PATH, JSON.stringify(models, null, 2));
    return new Response(JSON.stringify(newModel), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
