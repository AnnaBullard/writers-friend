import { fetch } from './csrf.js';

const GET_PSEUDONYMS = "pseudonyms/get";
const EDIT_PSEUDONYM = "pseudonyms/edit";
const NEW_PSEUDONYM = "pseudonyms/new";
const REMOVE_PSEUDONYM = "pseudonym/remove";

const setPseudonyms = (pseudonyms) => ({
    type: GET_PSEUDONYMS,
    pseudonyms
});

const changePseudonym = (pseudonym) => ({
    type: EDIT_PSEUDONYM,
    pseudonym
});

const addPseudonym = (pseudonym) => ({
    type: NEW_PSEUDONYM,
    pseudonym
});

const removePseudonym = (id) => ({
    type: REMOVE_PSEUDONYM,
    id
});

export const getPseudonyms = () => async dispatch => {
    const res = await fetch(`/api/pseudonyms`)
    if (res.ok) {
        dispatch(setPseudonyms(res.data));
    }
}

export const editPseudonym = (pseudo) => async dispatch => {
    const res = await fetch(`/api/pseudonyms/`, {
        method: "PATCH",
        body: JSON.stringify({...pseudo})
    });
    if (res.ok && !res.errors) {
        dispatch(changePseudonym(res.data))
    }
    return(res)
}

export const createPseudonym = (pseudo) => async dispatch => {
    const res = await fetch(`/api/pseudonyms/`, {
        method: "POST",
        body: JSON.stringify({...pseudo})
    });
    if (res.ok && !res.errors) {
        dispatch(addPseudonym(res.data))
    }
    return(res)
}

export const deletePseudonym = (id) => async dispatch => {
    const res = await fetch(`/api/pseudonyms/${id}`, {
        method: "DELETE"
    });
    if (res.ok && !res.errors) {
        dispatch(removePseudonym(res.data))
    }
    return(res)
}

export default function reducer(state = [], action) {
    switch (action.type) {
        case GET_PSEUDONYMS: {
            let newState = [...action.pseudonyms]
            return newState;
        }
        case EDIT_PSEUDONYM: {
            let newState = state.map(pseudonym => {
                if (pseudonym.id === action.pseudonym.id){
                    return action.pseudonym;
                } else {
                    if(action.pseudonym.isActive){
                        return {...pseudonym, isActive:false}
                    }
                    return pseudonym;
                }
            })
            return newState;
        }
        case NEW_PSEUDONYM: {
            let newState = [...state, action.pseudonym];
            return newState;
        }
        case REMOVE_PSEUDONYM: {
            let newState = [...state.filter(pseudonym => pseudonym.id !== action.id)];
            return newState;
        }
        default:
            return state
    }
}
