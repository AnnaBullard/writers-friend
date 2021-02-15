import {useState} from "react";
import {useDispatch} from "react-redux";
import {deleteEntity} from "../../store/entities";
import {flattenTree,repeat} from "./utils";
import sanitizeHtml from 'sanitize-html';

export default function ConfirmDelete ({onSubmit, onClose, entity}) {
    const dispatch = useDispatch();
    const types = [null,"story/chapter", "book", "book series", "world"]
    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")
    const tree = flattenTree([entity], 0, 0)
    let treeHTML = ``;
    let currentLvl;

    tree.forEach((item,idx)=>{
        if (idx===0 || item.level > currentLvl) {
            treeHTML += `<ul><li>${item.title}</li>`;
        } else if (item.level === currentLvl) {
            treeHTML += `<li>${item.title}</li>`;
        } else {
            treeHTML += repeat(currentLvl-item.level,"</ul>")
            treeHTML += `<li>${item.title}</li>`;
        }

        if (idx === tree.length-1){
            treeHTML += repeat(item.level+1,"</ul>")
        }

        currentLvl = item.level;
    })

    const onDelete = e => {
        e.preventDefault();
        if (confirmed) {
            dispatch(deleteEntity(entity.id))
            onClose();
        } else {
            setError(`You need to confirm, that you want to delete this ${types[entity.typeId]}`)
        }
    }

    return <form onSubmit={onDelete} className="confirm-box">
        <h3>Confirm detete</h3>
        {error?(<div className="errors">{error}</div>):""}
        <label>
        <input type="checkbox" checked={confirmed?"checked":false} onChange={()=>{setConfirmed(!confirmed)}}/>
        Yes, I wat to remove his {types[entity.typeId]}.
        </label>
        <div className="text" dangerouslySetInnerHTML={{__html: sanitizeHtml(treeHTML)}}></div>
        <button>Submit</button>
    </form>
}
