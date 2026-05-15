const store = new Map();

function getCache(key) {
  const cached = store.get(key);

  if (!cached) {
    return null;
  }

  if (Date.now() > cached.expiresAt) {
    store.delete(key);
    return null;
  }

  return cached.value;
}

function setCache(key, value, ttlMs = 60_000) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

function clearCache(prefix = "") {
  for (const key of store.keys()) {
    if (!prefix || key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

module.exports = {
  getCache,
  setCache,
  clearCache
};
