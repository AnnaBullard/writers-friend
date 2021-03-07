import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {flattenTree,repeat,getAuthorFormattedPseudonym} from "./utils"
import {createEntity, editEntity} from "../../store/entities";


export default function EntityForm({entity, onClose}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(entity?entity.title:"");
  const [description, setDescription] = useState((entity && entity.description)?entity.description:"");
  const [pseudonymId, setPseudonymId] = useState((entity && entity.pseudonymId)?entity.pseudonymId:0);
  const [typeId, setTypeId] = useState(entity.typeId);
  const [parentId, setParentId] = useState(entity.parentId?entity.parentId:0);
  const [isPublished, setIsPublished] = useState(entity?entity.isPublished:false);
  const [entitiesList, setEntititesList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const entityTypes = [null, "chapter/story", "book", "book series", "world"]

  const entities = useSelector(state => state.entities);
  const pseudonyms = useSelector(state => state.pseudonyms);

  useEffect(()=>{
    setEntititesList(flattenTree(entities, 0, typeId));
    setIsLoaded(true);

  },[entities,typeId])

  useEffect(()=>{
    if (isLoaded && parseInt(parentId) !==0 
      && !entitiesList.find(entity => entity.id === parseInt(parentId))) setParentId(0)
  },[entitiesList, isLoaded, parentId])

  const handleSubmit = (e) => {
    e.preventDefault();
    let newEntity = {
      title,
      pseudonymId:(parseInt(pseudonymId)>0?parseInt(pseudonymId):null),
      typeId: parseInt(typeId),
      parentId:(parseInt(parentId)>0?parseInt(parentId):null),
      isPublished};
    if (!entity.id) {
      dispatch(createEntity(newEntity)).then(res => {
          onClose();
        });
    } else {
      newEntity.id = entity.id;
      dispatch(editEntity(newEntity)).then(res => {
        onClose();
      });
    }
  };

  const handleCancel = e => {
    e.preventDefault();
    onClose();
  }

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
        <label htmlFor="entity-title" className="only-mobile">Title:</label>
        <input style={{gridColumn: "span 2"}}
          id="entity-title"
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
          <option value={0}>anonymous</option>
          {pseudonyms.map(pseudonym => <option value={pseudonym.id} key={`pseudonym-option-${pseudonym.id}`}>
              {getAuthorFormattedPseudonym(pseudonym)}
            </option>
          )}
        </select>
        <label htmlFor="entity-parent">Part of:</label>
        <select value={parentId} 
          onChange={e => setParentId(e.target.value)}
          id="entity-parent"
        >
          <option value={0}>set as standalone</option>
          {entitiesList.map(entity => <option value={entity.id} key={`entity-parent-option-${entity.id}`}>
              {repeat(entity.level,"-")}
              {(entity.title?entity.title:"untitled")}
              {entity.author}
            </option>
          )}
        </select>
        {!!entity.id && 
        <label style={{gridColumn: "span 2"}} onClick={()=>setIsPublished(!isPublished)} >
          {isPublished && <i className="fas fa-eye"></i>}
          {!isPublished && (<><i className="fas fa-eye-slash"></i>{` Not `}</>)}
          {` Public`}
        </label>}
        <label htmlFor="entity-description" className="only-mobile">Description:</label>
        <textarea
          id="entity-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        
      </div>
      <div>
        <button type="submit">{entity.id?`Edit `:`Create `}{entityTypes[typeId]}</button>
        <button type="reset" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}
