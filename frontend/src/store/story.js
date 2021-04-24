import { fetch } from './csrf.js';

const GET_STORY = "story/get";
const SET_CHILDREN = "story/children";

const setStory = (path, siblings, children) => ({
    type: GET_STORY,
    path, 
    siblings, 
    children
  });

const setChildren = (children) => ({
    type: SET_CHILDREN,
    children
  });

export const getStory = id => async (dispatch) => {
    const res = await fetch(`/api/story/${id?id:0}`);
    if (res.ok && !res.data.error) {
        let {path, siblings, children} = res.data;
        dispatch(setStory(path, siblings, children));
        return true;
    } else {
        return false;
    }
}

export const getChildren = id => async (dispatch) => {
    const res = await fetch(`/api/story/${id}/children`);
    if (res.ok && !res.data.error) {
        dispatch(setChildren(res.data));
        return true;
    } else {
        return false;
    }
}

const initialState = {
    path: [], 
    siblings: [], 
    children: []
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_STORY: {
            let siblings = action.siblings.map((item, idx)=>({...item, idx}))
            let newState = {
                path: action.path, 
                siblings, 
                children: action.children
            }
            return newState;
        }
        case SET_CHILDREN: {
            let newState = {...state, children: action.children}
            return newState
        }
        default:
            return state;
    }
}
