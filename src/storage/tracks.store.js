/**
 * Storage em memória (Map)
 * MVP simples e rápido
 */

const tracks = new Map();

/**
 * Cria uma nova track
 */
export function createTrack(data) {
  tracks.set(data.id, {
    createdAt: Date.now(),
    ...data,
  });
}

/**
 * Atualiza dados da track
 */
export function updateTrack(id, data = {}) {
  if (!tracks.has(id)) return false;

  tracks.set(id, {
    ...tracks.get(id),
    ...data,
    updatedAt: Date.now(),
  });

  return true;
}

/**
 * Retorna uma track pelo ID
 */
export function getTrackById(id) {
  return tracks.get(id) || null;
}

/**
 * Debug
 */
export function getAllTracks() {
  return Array.from(tracks.values());
}
