import { fetch } from './csrf.js';

const GET_SCENES = "scenes/get"
const REORDER_SCENES = "scenes/re-order"
const SET_TITLE="scenes/set_title"
const SAVE_SCENES = "scenes/save"
const JOIN_SCENES = "scenes/join"

const setScenes = (chapter, scenes) => ({
    type: GET_SCENES,
    chapter,
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

export const joinScenes = (id1, id2) => ({
    type: JOIN_SCENES,
    id1,
    id2
})

export const getScenes = id => async (dispatch) => {
    const res = await fetch(`/api/scenes/${id}`);
    if (res.ok) {
        let chapter = res.data.entity;
        let scenes = res.data.scenes;
        dispatch(setScenes(chapter, scenes));
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
    chapter: null, 
    scenes: [], 
    deleted: [],
    saved:false,
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_SCENES: {
            let newState = {}
            newState.chapter = action.chapter;
            newState.scenes = action.scenes;
            newState.saved = true
            newState.deleted = []
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
            let chapter = {...state.chapter};
            chapter.title = action.title;
            let newState = {...state, chapter};
            newState.saved = false;
            return newState;
        }
        case SAVE_SCENES: {
            let newState = {chapter: {...state.chapter}, deleted:[], saved: true}
            let newScenes = state.scenes.map(s => {
                let newS = {...s};
                delete newS.updated;
                return newS;
            })
            newState.scenes = newScenes;
            return newState;
        }
        case JOIN_SCENES: {
            let sceneToDelete = state.scenes.find(s => s.id === action.id2)
            let scenes = state.scenes.filter(s => s.id !== action.id2)
                                        .map((scene, idx) => {
                                            if (scene.id === action.id1) {
                                                scene.text = scene.text + "\n" + sceneToDelete.text
                                                scene.updated = true
                                            }
                                            if (scene.order != idx) {
                                                scene.order = idx
                                                scene.updated = true
                                            }
                                            return scene;
                                        })
            let deleted = [...state.deleted];
            deleted.push(sceneToDelete.id);
            let newState = {...state, scenes, deleted};
            return newState;
        }
        default:
            return state
    }
}
