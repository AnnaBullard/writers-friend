import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {flattenTree,repeat} from "./utils"


export default function EntityForm({entity}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(entity?entity.title:"");
  const [description, setDescription] = useState(entity?entity.description:"");
  const [pseudonymId, setPseudonymId] = useState((entity && entity.pseudonymId)?entity.pseudonymId:undefined);
  const [typeId, setTypeId] = useState(entity?entity.typeId:1);
  const [parentId, setParentId] = useState((entity && entity.parentId)?entity.parentId:null);
  const [isPublished, setIsPublished] = useState(entity?entity.isPublished:false);
  const [errors,setErrors] = useState([])
  const [entitiesList, setEntititesList] = useState([])

  const entityTypes = [null, "chapter/story", "book", "book series", "world"]

  const user = useSelector(state => state.session.user);
  const entities = useSelector(state => state.entities);

  useEffect(()=>{
    setEntititesList(flattenTree(entities, 0, typeId))
  },[entities,typeId])

  useEffect(()=>{
    console.log(entitiesList)
  },[typeId])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({...entity,title,pseudonymId,typeId,parentId,isPublished})
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Entity Form</h3>
      <ul style={errors.length?{}:{display: "none"}}>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <select 
          value={pseudonymId}
          onChange={e => setPseudonymId(e.target.value)}
        >
          <option value={undefined}>{user.username}</option>
        </select>
        <select 
          value={typeId} 
          disabled={entity && entity.typeId===1}
          onChange={e => setTypeId(e.target.value)}
        >
          <option value={4}>world</option>
          <option value={3}>book series</option>
          <option value={2}>book</option>
          <option value={1}>{parentId?"chapter":"story"}</option>
        </select>
        <select value={parentId} 
          onChange={e => setParentId(e.target.value)}
        >
          <option value={undefined}>set as standalone</option>
          {entitiesList.map(entity =>{
            return <option value={entity.id}>
              {repeat(entity.level,"-")}
              {(entity.title?entity.title:"untitled")}
              {entity.author}
            </option>
          })}
        </select>
        <input type="checkbox" checked={isPublished?"checked":false} onClick={()=>setIsPublished(!isPublished)}/>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        
      </div>
      <button type="submit">{entity.id?`Edit `:`Save `}{entityTypes[typeId]}</button>
    </form>
  );
}
