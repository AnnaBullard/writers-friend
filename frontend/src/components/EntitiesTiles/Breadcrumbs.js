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

    return <ul className="breadcrumbs">
        <li><Link to={`/workshop`} ><i className="fas fa-book-open"></i> All</Link></li>
        {breadcrumbs.map((parent) => {
            return <li key={`breadcrumb-${parent.id}`} >
                <Link to={`/workshop/${parent.id}`} ><i className="fas fa-book-open"></i> {parent.title}</Link>
            </li>
        })}
    </ul>
}