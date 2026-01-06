/**
 * Storage em memória (Map)
 * MVP simples e rápido
 * Pode ser trocado futuramente por Redis / DB sem quebrar rotas
 */

const tracks = new Map();

/**
 * Cria uma nova track
 */
export function createTrack(id, data = {}) {
  tracks.set(id, {
    id,
    status: "processing",
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
export function getTrack(id) {
  return tracks.get(id) || null;
}

/**
 * Retorna todas as tracks (debug / admin)
 */
export function getAllTracks() {
  return Array.from(tracks.values());
}

/**
 * Remove uma track (opcional)
 */
export function deleteTrack(id) {
  return tracks.delete(id);
}

/**
 * Limpa tudo (dev only)
 */
export function clearTracks() {
  tracks.clear();
}
