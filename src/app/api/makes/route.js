import { promises as fs } from "fs";
import path from "path";

const MAKES_PATH = path.join(process.cwd(), "data", "makes.json");

export async function GET() {
  try {
    const data = await fs.readFile(MAKES_PATH, "utf-8");
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
      await fs.writeFile(MAKES_PATH, JSON.stringify(body, null, 2));
      return new Response(JSON.stringify(body), { status: 200 });
    }
    // Otherwise, treat as add operation
    const { makeId, name, logo } = body;
    if (!makeId || !name) {
      return new Response(
        JSON.stringify({ error: "makeId and name are required" }),
        { status: 400 }
      );
    }
    let makes = [];
    try {
      const file = await fs.readFile(MAKES_PATH, "utf-8");
      makes = JSON.parse(file);
    } catch {
      makes = [];
    }
    if (makes.some((m) => m.makeId === makeId)) {
      return new Response(JSON.stringify({ error: "Make ID already exists" }), {
        status: 400,
      });
    }
    if (makes.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Make name already exists" }),
        { status: 400 }
      );
    }
    const newMake = { makeId, name, logo };
    makes.push(newMake);
    await fs.writeFile(MAKES_PATH, JSON.stringify(makes, null, 2));
    return new Response(JSON.stringify(newMake), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
