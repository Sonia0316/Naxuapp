export default {
  setItem(key, value) {
    return Promise.resolve().then(() => {
      localStorage.setItem(key, value);
    });
  },
  getItem(key) {
    return Promise.resolve().then(() => {
      return localStorage.getItem(key);
    });
  },
  clearItem(key) {
    return Promise.resolve().then(() => {
      return localStorage.removeItem(key);
    });
  },
};
