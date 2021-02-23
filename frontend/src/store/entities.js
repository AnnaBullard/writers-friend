import { fetch } from './csrf.js';
import {addEntity, removeEntity, deepSort, moveEntity} from "./utils";

const GET_ENTITIES = "entities/get";
const ADD_ENTITY = "entities/add";
const REMOVE_ENTITY = "entities/remove";
const EDIT_ENTITY = "entities/edit";


const setEntities = (entities) => ({
    type: GET_ENTITIES,
    entities
  });

const addNewEntitiy = (entity) => ({
    type: ADD_ENTITY,
    entity
  });

const removeEntitiyAction = (entity) => ({
    type: ADD_ENTITY,
    entity
  });

const updateEntitiy = (entity) => ({
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
    return dispatch(addNewEntitiy(res.data));
}

export const editEntity = (entity) => async dispatch => {
    const res = await fetch("/api/entities",{
        method: "PATCH",
        body: JSON.stringify({entity})
    })
    return dispatch(updateEntitiy(res.data));
}

export const deleteEntity = (id) => async dispatch => {
    const res = await fetch(`/api/entities/${id}`,{
        method: "DELETE"
    })
    return dispatch(removeEntitiyAction(res.data));
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
            newState = removeEntity(newState, action.entity);
            return newState;
        }
        case EDIT_ENTITY: {
            let newState = [...state];
            newState = moveEntity(newState, action.entity);
            return newState;
        }
        default:
            return state
    }
}
