import { fetch } from './csrf.js';

const GET_ENTITIES = "entities/get";

const setEntities = (entities) => ({
    type: GET_ENTITIES,
    entities
  });

const deepSort = (entitiesArray) => {
    let arr = entitiesArray.sort((a,b)=>{
        let result
        if (a.order<b.order || (a.order===b.order && a.title < b.title)) result = -1;
        else result = 1;
        return result;
    })
    arr = arr.map(entity=>{
        if (entity.typeId > 1 && entity.children && entity.children.length){
            entity.children = deepSort(entity.children);
        } 
        return entity

    })
    return arr
}

export const getEntities = () => async (dispatch) => {
    const res = await fetch('/api/entities');
    if (res.ok) {
        dispatch(setEntities(res.data));
    }
}

export const createEntity = (entity) => async dispatch => {
    const res = await fetch("/api/entities",{
        method: "POST",
        body: JSON.stringify({entity})
    })
    if (res.ok) {
        dispatch(setEntities(res.data));
    }
}

export const deleteEntity = (id) => async dispatch => {
    const res = await fetch(`/api/entities/${id}`,{
        method: "DELETE"
    })
    if (res.ok) {
        dispatch(setEntities(res.data));
    }
}

export default function reducer(state = [], action) {
    switch (action.type) {
        case GET_ENTITIES: {
            let newState = [...deepSort(action.entities)]
            return newState;
        }
        default:
            return state
    }
}
