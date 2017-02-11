const isSame = (itemA, itemB) => (itemA && itemB && itemA.getCartId() === itemB.getCartId());
const Item = require('n3000/shared/item-model');

const cart = (state = [], { type, payload }) => {
  console.log(state);
  switch (type) {
    case 'ADD_CART':
      const addition = new Item(payload);
      console.log(addition.getCartId());
      let index = state.findIndex(item => isSame(item, addition));
      if (index >= 0) {
        state[index].quantity += 1;
        return [...state];
      }
      addition.quantity++;
      return [
        ...state,
        addition,
      ];

    case 'REMOVE_CART':
      const removeAll = new Item(payload);
      return state.filter(item => !isSame(item, removeAll));

    case 'UDP_CART_QTY':
      const updatedItem = new Item(payload);
      index = state.findIndex(item => isSame(item, updatedItem));
      state[index].quantity = payload.quantity;
      if (state[index].quantity <= 0) {
        state = state.filter(item => !isSame(item, updatedItem));
      }
      return [...state];

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

module.exports = cart;
