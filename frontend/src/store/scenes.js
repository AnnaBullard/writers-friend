import { fetch } from './csrf.js';

const GET_SCENES = "scenes/get"

const setScenes = (book, scenes) => ({
    type: GET_SCENES,
    book,
    scenes
  });

export const getScenes = id => async (dispatch) => {
    const res = await fetch(`/api/scenes/${id}`);
    if (res.ok) {
        let book = res.data.entity;
        let scenes = res.data.scenes;
        dispatch(setScenes(book, scenes));
    }
}

export default function reducer(state = {book: null, scenes: []}, action) {
    switch (action.type) {
        case GET_SCENES: {
            let newState = {}
            newState.book = action.book;
            newState.scenes = action.scenes;
            return newState;
        }
        default:
            return state
    }
}
