const tracks = new Map();

export function createTrack(id, data) {
  tracks.set(id, { id, ...data });
}

export function updateTrack(id, data) {
  if (!tracks.has(id)) return;
  tracks.set(id, { ...tracks.get(id), ...data });
}

export function getTrack(id) {
  return tracks.get(id);
}
