export function urlModel(id, url, TTL, createdAt) {
  return {
    _id: id,
    longUrl: url,
    expiresAt: TTL,
    createdAt: new Date(),
  };
}
