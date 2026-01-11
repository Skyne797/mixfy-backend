const tracks = new Map();

export function createTrack(track) {
  tracks.set(track.id, track);
}

export function updateTrack(id, data) {
  if (!tracks.has(id)) return false;

  tracks.set(id, {
    ...tracks.get(id),
    ...data,
  });

  return true;
}

export function getTrack(id) {
  return tracks.get(id) || null;
}
