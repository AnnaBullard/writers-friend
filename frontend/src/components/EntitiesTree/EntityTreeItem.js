import EntitiesTreeList from "./EntitiesTreeList";
import Join from "./Join";
import Position from "./Position";

export default function EntityTreeItem ({entity})  {

    return <div >
        <Position parentId={entity.parentId} order={entity.order} />
        <Join entity={entity}/>
        {entity.children && entity.children.length > 0 && <EntitiesTreeList entities={entity.children} />}
    </div>
}