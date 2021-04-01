import {useSelector} from "react-redux";
import EntitiesTreeList from "./EntitiesTreeList";
import Sidebar from "../Sidebar";
import { useState } from "react";

export default function EntitiesTree () {
    let entities = useSelector(state => state.entities);
    let [isOpen, setIsOpen] = useState(true);
    
    return <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} active={true}>
        <div className="entities-tree">
            <EntitiesTreeList entities={entities} />
        </div>
    </Sidebar>
}