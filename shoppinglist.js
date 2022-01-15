let items = [];

const getList = () => items;

const addItem = (item) => {
  if (items.includes(item)) {
    return;
  } else {
    items = [...items, item];
  }
};

// Returns true on success
const removeItem = (idx) => {
  if (isNaN(idx) || idx < 0 || idx > items.length - 1) {
    return false;
  }

  items = items.filter((_, i) => i !== idx);
  return true;
};

const clear = () => {
  items = [];
};

module.exports = { getList, addItem, removeItem, clear };
