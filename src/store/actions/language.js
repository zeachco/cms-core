import store from '..';

const {dispatch} = store;

export function setLanguage(lang, data) {
    dispatch({type: 'SET_LANGUAGE', payload: lang, data});
}