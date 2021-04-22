import { fetch } from './csrf.js';
import {addEntity, removeEntity, updateEntity, deepSort} from "./utils";

const GET_ENTITIES = "entities/get";
const ADD_ENTITY = "entities/add";
const REMOVE_ENTITY = "entities/remove";
const EDIT_ENTITY = "entities/edit";


const setEntities = (entities) => ({
    type: GET_ENTITIES,
    entities
  });

const add = (entity) => ({
    type: ADD_ENTITY,
    entity
  });

const remove = (id) => ({
    type: REMOVE_ENTITY,
    id
  });

export const update = (entity) => ({
    type: EDIT_ENTITY,
    entity
  });

export const getEntities = () => async (dispatch) => {
    const res = await fetch('/api/entities');
    return dispatch(setEntities(res.data));
}

export const createEntity = (entity) => async dispatch => {
    const res = await fetch("/api/entities",{
        method: "POST",
        body: JSON.stringify({entity})
    })
    if (!res.errors)
        return dispatch(add(res.data));
}

export const editEntity = (entity) => async dispatch => {
    const formData = new FormData();

    for (let key in entity) {
        formData.append(key, entity[key])
    }

    const res = await fetch("/api/entities",{
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData
    })
    if (!res.errors){
        dispatch(update(entity))
        return {ok: "success"}
    }
    else return {error: "Something went wrong"}
}

export const changeEntityPosition = (entity, locally) => async dispatch => {
    dispatch(update(entity));
    if (!locally) {
        const res = await fetch("/api/entities",{
            method: "PATCH",
            body: JSON.stringify({entity})
        })
        return res;
    }
}

export const deleteEntity = (id) => async dispatch => {
    const res = await fetch(`/api/entities/${id}`,{
        method: "DELETE"
    })
    if (!res.errors)
        return dispatch(remove(id));
}

export default function reducer(state = [], action) {
    switch (action.type) {
        case GET_ENTITIES: {
            let newState = [...deepSort(action.entities)]
            return newState;
        }
        case ADD_ENTITY: {
            let newState = [...state];
            newState = addEntity(newState, action.entity);
            return newState;
        }
        case REMOVE_ENTITY:{
            let newState = [...state];
            newState = removeEntity(newState, action.id);
            return newState;
        }
        case EDIT_ENTITY: {
            let newState = [...state];
            newState = updateEntity(newState, action.entity);
            return newState;
        }
        default:
            return state
    }
}
