export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
