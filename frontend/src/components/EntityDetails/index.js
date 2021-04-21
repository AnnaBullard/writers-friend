export default function EntityDetails({entity}) {

    return !!entity && <div className="entity-details">
        {entity.title}
    </div>
}