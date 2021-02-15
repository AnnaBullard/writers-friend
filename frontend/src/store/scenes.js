import { fetch } from './csrf.js';

const GET_SCENES = "scenes/get";
const REORDER_SCENES = "scenes/re-order";
const SET_TITLE="scenes/set_title";
const EDIT_TEXT="scenes/edit_text";
const SAVE_SCENES = "scenes/save";
const UNSAVE_SCENES = "scenes/unsaved";
const JOIN_SCENES = "scenes/join";
const DELETE_SCENE = "scenes/delete";
const CREATE_SCENE = "scenes/create";

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

export const setSaved = (newScenes) => ({
    type: SAVE_SCENES,
    newScenes
})

export const setUnsaved = (id, text) => ({
    type: UNSAVE_SCENES,
    id,
    text
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

export const createScene = () => ({
    type: CREATE_SCENE
})

export const getScenes = id => async (dispatch) => {
    const res = await fetch(`/api/scenes/${id}`);
    if (res.ok && !res.data.error) {
        let chapter = res.data.entity;
        let scenes = res.data.scenes;
        dispatch(setScenes(chapter, scenes));
        return true
    } else {
        return false
    }
}

export const getScenesToRead = id => async (dispatch) => {
    const res = await fetch(`/api/scenes/${id}/read`);
    if (res.ok && !res.data.error) {
        let chapter = res.data.entity;
        let scenes = res.data.scenes;
        dispatch(setScenes(chapter, scenes));
        return true
    } else {
        return false
    }
}

export const saveScenes = (id, updates) => async (dispatch) => {
    const res = await fetch(`/api/scenes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({updates})
    });
    if (res.ok)
        dispatch(setSaved(res.data.newScenes))
}

export const quickStart = () => async (dispatch) => {
    const res = await fetch(`/api/scenes/start`);
    if (res.ok && !res.data.error){
        let chapter = res.data.entity;
        let scenes = res.data.scenes;
        dispatch(setScenes(chapter, scenes));
        return chapter.id;
    }
    return false;
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
                    delete newScene.temp
                    return newScene;
                } else {
                    return scene;
                }
            })
            let newState = {...state, scenes, saved: false}
            return newState;
        }
        case SAVE_SCENES: {
            let scenes = state.scenes.map(scene => {
                let newScene = {...scene};
                if (scene.temp) {
                    newScene.text = scene.temp;
                    delete newScene.temp;
                }
                if(scene.id in action.newScenes) newScene.id = action.newScenes[scene.id]
                delete newScene.updated;
                return newScene;
            })
            let newState = {...state, scenes, deleted:[], saved: true}
            return newState;
        }
        case UNSAVE_SCENES: {
            let scenes = state.scenes.map(scene => {
                if (scene.id === action.id) {
                    let newScene = {...scene, temp: action.text, updated:true}
                    return newScene;
                } else {
                    return scene;
                }
            })
            let newState = {...state, scenes, saved: false}
            return newState;
        }
        case JOIN_SCENES: {
            let sceneToDelete = state.scenes.find(scene => scene.id === action.id2)
            let scenes = state.scenes.filter(scene => scene.id !== action.id2)
                                        .map((scene, idx) => {
                                            if (scene.id === action.id1) {
                                                scene.text = (scene.temp || scene.text) + "\n" + (sceneToDelete.temp || sceneToDelete.text)
                                                delete scene.temp
                                                scene.updated = true
                                            }
                                            if (scene.order !== idx) {
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
        case CREATE_SCENE: {
            let count = state.scenes.filter(scene => typeof scene.id !== "number").length;
            let scene = {id: "new"+count, text: "", order:state.scenes.length, updated:true};
            let newState = {...state, scenes: [...state.scenes, scene], saved: true};
            return newState
        }
        default:
            return state
    }
}
