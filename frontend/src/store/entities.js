import { fetch } from './csrf.js';

const GET_ENTITIES = "entities/get"

const setEntities = (entities) => ({
    type: GET_ENTITIES,
    entities
  });

export const getEntities = () => async (dispatch) => {
    const res = await fetch('/api/entities');
    if (res.ok) {
        console.log("Entities: ", res.data)
    }
}

export default function reducer(state = [], action) {
    switch (action.type) {
        default:
            return state
    }
}
