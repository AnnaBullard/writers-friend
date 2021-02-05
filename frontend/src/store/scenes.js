import { fetch } from './csrf.js';

const GET_SCENES = "scenes/get"
const REORDER_SCENES = "scenes/re-order"
const SET_TITLE="scenes/set_title"
const SAVE_SCENES = "scenes/save"

const setScenes = (book, scenes) => ({
    type: GET_SCENES,
    book,
    scenes
  });

export const setNewOrder = (order) => ({
    type: REORDER_SCENES,
    order
})

export const setNewTitle = (title) => ({
    type: SET_TITLE,
    title
})

export const setSaved = () => ({
    type: SAVE_SCENES
})

export const getScenes = id => async (dispatch) => {
    const res = await fetch(`/api/scenes/${id}`);
    if (res.ok) {
        let book = res.data.entity;
        let scenes = res.data.scenes;
        dispatch(setScenes(book, scenes));
    }
}

export const saveScenes = (id, updates) => async (dispatch) => {
    const res = await fetch(`/api/scenes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({updates})
    });
    if (res.ok)
        dispatch(getScenes(id))
}

const initialState = {
    book: null, 
    scenes: [], 
    delete: [],
    saved:false,
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_SCENES: {
            let newState = {}
            newState.book = action.book;
            newState.scenes = action.scenes;
            newState.saved = true
            return newState;
        }
        case REORDER_SCENES:{
            let scenes = action.order.map((id, idx) => {
                let current = {...state.scenes.find(s => s.id === id)}
                if (current.order !== idx){
                    current.order = idx;
                    current.updated = true;
                }
                return current;
            })
            let newState = {...state, scenes};
            newState.saved = false;
            return newState;

        }
        case SET_TITLE: {
            let book = {...state.book};
            book.title = action.title;
            let newState = {...state, book};
            newState.saved = false;
            return newState;
        }
        case SAVE_SCENES: {
            let newState = {book: {...state.book}, delete:[], saved: true}
            let newScenes = state.scenes.map(s => {
                let newS = {...s};
                delete newS.updated;
                return newS;
            })
            newState.scenes = newScenes;
            return newState;
        }
        default:
            return state
    }
}
