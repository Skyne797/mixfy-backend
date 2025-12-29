const tracks = new Map();

export function createTrack(id) {
  tracks.set(id, { status: "processing" });
}

export function updateTrack(id, data) {
  const track = tracks.get(id);
  if (track) {
    tracks.set(id, { ...track, ...data });
  }
}

export function getTrack(id) {
  return tracks.get(id);
}
