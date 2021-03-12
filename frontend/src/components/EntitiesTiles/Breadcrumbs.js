import { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {useParams, Link} from "react-router-dom";
import {getPath} from "../Workshop/utils";

export default function Breadcrumbs () {
    let entities = useSelector(state => state.entities);
    let {entityId} = useParams();

    const [breadcrumbs, setBreadcrumbs] = useState([])
    
    useEffect(()=>{
        if(entityId) {
            setBreadcrumbs(getPath(parseInt(entityId),entities))
        } else {
            setBreadcrumbs([]);
        }

    },[entityId, entities])

    return <ul>
        {breadcrumbs.map((parent,idx) => {
            return <li key={`breadcrumb-${parent.id}`} style={{paddingLeft: `${(idx+1)*10}px`}} >
                <Link to={`/workshop/${parent.id}`} ><i className="fas fa-book-open"></i> {parent.title}</Link>
            </li>
        })}
    </ul>
}