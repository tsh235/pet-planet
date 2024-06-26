export const getDataFromLS = (key) =>
  JSON.parse(localStorage.getItem(key) || '[]');

export const setDataToLS = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const removeFromLS = (key) =>
  localStorage.removeItem(key);