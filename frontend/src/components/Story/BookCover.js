import {Link} from "react-router-dom";

export default function BookCover({entity}) {
    return <div>
        <Link to={`/story/${entity.id}`}>
            {entity.title}
        </Link>
    </div>
}