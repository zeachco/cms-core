import axios from 'axios';
import store from '..';

export const addToCart = item => ({
  type: 'ADD_CART',
  payload: {...item}
});

export const removeFromCart = item => {
  if (item.quantity <= 1) {

  }
  return {
    type: 'REMOVE_CART',
    payload: { ...item }
  };
};

export const updateItemQuantity = item => ({
  type: 'UDP_CART_QTY',
  payload: { ...item }
});

export const clearCart = () => ({
  type: 'CLEAR_CART'
});

export const sendCart = data => {
  store.dispatch({
    type: 'CART_SUBMIT',
    payload: data
  });
  axios.post('/api/cart/rpi', data).then(xhr => {
    store.dispatch({
      type: 'CART_SUBMITED',
      payload: xhr.response
    });
  }).catch(err => {
    store.dispatch({
      type: 'CART_SUBMIT_ERROR',
      payload: err
    });
  });
};