export async function urlModel(id, url, TTL, createdAt) {
  return {
    _id: id,
    longUrl: url,
    createdAt: new Date(),
    expiresAt: TTL,
  };
}
