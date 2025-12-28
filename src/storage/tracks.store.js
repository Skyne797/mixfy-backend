const tracks = new Map();

export function createTrack(trackId) {
  tracks.set(trackId, {
    status: "processing",
    audioUrl: null,
  });
}

export function updateTrack(trackId, data) {
  if (!tracks.has(trackId)) return;
  tracks.set(trackId, {
    ...tracks.get(trackId),
    ...data,
  });
}

export function getTrack(trackId) {
  return tracks.get(trackId);
}
