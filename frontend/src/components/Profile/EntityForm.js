import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {flattenTree,repeat} from "./utils"
import {createEntity} from "../../store/entities";


export default function EntityForm({entity, onClose}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(entity?entity.title:"");
  const [description, setDescription] = useState(entity?entity.description:"");
  const [pseudonymId, setPseudonymId] = useState((entity && entity.pseudonymId)?entity.pseudonymId:undefined);
  const [typeId, setTypeId] = useState(entity.typeId);
  const [parentId, setParentId] = useState(entity.parentId);
  const [isPublished, setIsPublished] = useState(entity?entity.isPublished:false);
  const [entitiesList, setEntititesList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const entityTypes = [null, "chapter/story", "book", "book series", "world"]

  const user = useSelector(state => state.session.user);
  const entities = useSelector(state => state.entities);

  useEffect(()=>{
    setEntititesList(flattenTree(entities, 0, typeId));
    setIsLoaded(true);
  },[entities,typeId])

  useEffect(()=>{
    if (isLoaded && !entitiesList.find(entity => entity.id === parentId)) setParentId(0)
  },[entitiesList])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entity.id) {
      dispatch(createEntity({
        ...entity,
        title,
        pseudonymId:(pseudonymId>0?pseudonymId:null),
        typeId,
        parentId:(parentId>0?parentId:null),
        isPublished})).then(res => {
          onClose();
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{entity.id?`Edit `:`Create new `}{entityTypes[typeId]}</h3>
      <div>
        <label htmlFor="entity-type">Type:</label>
        <select 
          value={typeId} 
          disabled={entity.id && entity.typeId===1}
          onChange={e => setTypeId(e.target.value)}
          id="entity-type"
        >
          <option value={4}>world</option>
          <option value={3}>book series</option>
          <option value={2}>book</option>
          <option value={1}>{parentId?"chapter":"story"}</option>
        </select>
        <input style={{gridColumn: "span 2"}}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <label htmlFor="entity-pseudonym">Author:</label>
        <select 
          value={pseudonymId}
          onChange={e => setPseudonymId(e.target.value)}
          id="entity-pseudonym"
        >
          <option value={0}>{user.username}</option>
        </select>
        <label htmlFor="entity-parent">Part of:</label>
        <select value={parentId} 
          onChange={e => setParentId(e.target.value)}
          id="entity-parent"
        >
          <option value={0}>set as standalone</option>
          {entitiesList.map(entity =>{
            return <option value={entity.id} key={`entity-parent-option-${entity.id}`}>
              {repeat(entity.level,"-")}
              {(entity.title?entity.title:"untitled")}
              {entity.author}
            </option>
          })}
        </select>
        {!!entity.id && 
        <label style={{gridColumn: "span 2"}} onClick={()=>setIsPublished(!isPublished)} >
          {isPublished && <i className="fas fa-eye"></i>}
          {!isPublished && (<><i className="fas fa-eye-slash"></i>{` Not `}</>)}
          {` Public`}
        </label>}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        
      </div>
      <button type="submit">{entity.id?`Edit `:`Create `}{entityTypes[typeId]}</button>
    </form>
  );
}
