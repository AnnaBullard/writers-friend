import { fetch } from './csrf.js';

const GET_SCENES = "scenes/get"
const REORDER_SCENES = "scenes/re-order"
const SET_TITLE="scenes/set_title"
const EDIT_TEXT="scenes/edit_text"
const SAVE_SCENES = "scenes/save"
const JOIN_SCENES = "scenes/join"
const DELETE_SCENE = "scenes/delete"

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

export const editText = (id, text) => ({
    type: EDIT_TEXT,
    id,
    text
})

export const setSaved = () => ({
    type: SAVE_SCENES
})

export const joinScenes = (id1, id2) => ({
    type: JOIN_SCENES,
    id1,
    id2
})

export const deleteScene = (id) => ({
    type: DELETE_SCENE,
    id
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
            let newState = {
                chapter: action.chapter,
                scenes: action.scenes,
                saved: true,
                deleted: []
            }
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
            let newState = {...state, scenes, saved: false};
            return newState;

        }
        case SET_TITLE: {
            let chapter = {...state.chapter};
            chapter.title = action.title;
            let newState = {...state, chapter, saved: false};
            return newState;
        }
        case EDIT_TEXT: {
            let scenes = state.scenes.map(scene => {
                if (scene.id === action.id) {
                    let newScene = {...scene, text: action.text, updated:true}
                    return newScene;
                } else {
                    return scene;
                }
            })
            let newState = {... state, scenes, saved: false}
            return newState;
        }
        case SAVE_SCENES: {
            let scenes = state.scenes.map(s => {
                let newS = {...s};
                delete newS.updated;
                return newS;
            })
            let newState = {...state, scenes, deleted:[], saved: true}
            return newState;
        }
        case JOIN_SCENES: {
            let sceneToDelete = state.scenes.find(scene => scene.id === action.id2)
            let scenes = state.scenes.filter(scene => scene.id !== action.id2)
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
            let deleted = [...state.deleted, sceneToDelete.id];
            let newState = {...state, scenes, deleted, saved: false};
            return newState;
        }
        case DELETE_SCENE: {
            let sceneToDelete = state.scenes.find(scene => scene.id === action.id)
            let scenes = state.scenes.filter(scene => scene.id !== action.id)
                                     .map((scene, idx) => {
                                         if (scene.order !== idx) {
                                             scene.order = idx;
                                             scene.updated = true;
                                         }
                                         return scene;
                                     })
            let deleted = [...state.deleted, sceneToDelete.id]
            let newState = {...state, scenes, deleted, saved: false}
            return newState
        }
        default:
            return state
    }
}
