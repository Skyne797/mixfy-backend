import fs from "fs";
import path from "path";

const FILE_PATH = path.resolve("tracks.json");

function read() {
  if (!fs.existsSync(FILE_PATH)) return {};
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
}

function write(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

export function createTrack(id, data) {
  const db = read();
  db[id] = { id, ...data, createdAt: Date.now() };
  write(db);
}

export function updateTrack(id, data) {
  const db = read();
  if (!db[id]) return false;
  db[id] = { ...db[id], ...data, updatedAt: Date.now() };
  write(db);
  return true;
}

export function getTrack(id) {
  const db = read();
  return db[id] || null;
}
